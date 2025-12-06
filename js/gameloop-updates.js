// ===========================================
// GAME LOOP - Asset Updates
// ===========================================

import { game } from './state.js';
import { economyPhases, lifestyles, jobs, jobLevels, education } from './config.js';
import { formatMoney, getDiversificationBonus, getConcentrationPenalty, getPassiveIncome } from './core.js';
import { showToast, logEvent } from './utils.js';
import { sellAsset } from './modals-extra.js';

export function updateProperty(property) {
    const phase = economyPhases[game.economyPhase];
    
    if (property.isVacant) {
        property.vacantMonths--;
        if (property.vacantMonths <= 0) {
            property.isVacant = false;
            logEvent(`🏠 ${property.name} is now rented!`, 'positive');
        }
    } else {
        const monthlyVacancyRisk = (property.vacancyRate * phase.vacancyMod) / 12;
        if (Math.random() < monthlyVacancyRisk) {
            property.isVacant = true;
            property.vacantMonths = 1 + Math.floor(Math.random() * 3);
            logEvent(`🏚️ ${property.name} is now vacant!`, 'negative');
        }
    }
    
    const monthlyAppreciation = property.appreciation / 12;
    property.value = Math.round(property.value * (1 + monthlyAppreciation));
}

export function updateBusiness(business) {
    if (business.failed) return;
    
    const phase = economyPhases[game.economyPhase];
    business.monthsOwned++;
    
    const failureRiskMod = game.economyPhase === 'recession' ? 1.5 : 1;
    const monthlyFailureRisk = (business.failureRisk * failureRiskMod) / 12;
    
    if (Math.random() < monthlyFailureRisk) {
        business.failed = true;
        business.income = 0;
        business.value = Math.round(business.value * 0.3);
        logEvent(`💔 ${business.name} has failed!`, 'negative');
        showToast(`😢 ${business.name} failed!`);
        return;
    }
    
    const monthlyGrowth = business.growth / 12;
    const economyMod = phase.businessMod;
    business.income = Math.round(business.income * (1 + monthlyGrowth) * (economyMod > 1 ? 1.002 : economyMod < 1 ? 0.998 : 1));
    business.value = Math.round(business.value * (1 + monthlyGrowth));
    
    if (!business.canExpand && Math.random() < 0.02) {
        business.canExpand = true;
    }
}

export function updateStock(stock) {
    const phase = economyPhases[game.economyPhase];
    stock.monthsHeld++;
    
    const baseReturn = stock.returnRate / 12;
    const economyMod = phase.stockMod;
    const volatilityFactor = (Math.random() - 0.5) * stock.volatility / 3;
    
    let monthlyReturn = baseReturn * economyMod + volatilityFactor;
    
    monthlyReturn += getDiversificationBonus() / 12;
    monthlyReturn += getConcentrationPenalty() / 12;
    
    stock.value = Math.round(stock.value * (1 + monthlyReturn));
    
    if (stock.dividend) {
        stock.dividendIncome = Math.round(stock.value * stock.dividend / 12);
    }
}

export function updateCrypto(crypto) {
    const phase = economyPhases[game.economyPhase];
    crypto.monthsHeld++;
    
    const baseReturn = crypto.returnRate / 12;
    const economyMod = phase.stockMod;
    const volatilityFactor = (Math.random() - 0.5) * (crypto.volatility || 0) / 2.5;
    
    let monthlyReturn = baseReturn * economyMod + volatilityFactor;
    monthlyReturn += getDiversificationBonus() / 12;
    monthlyReturn += getConcentrationPenalty() / 12;
    
    crypto.value = Math.max(0, Math.round(crypto.value * (1 + monthlyReturn)));
    
    if (crypto.stakingYield) {
        crypto.stakingIncome = Math.round(crypto.value * crypto.stakingYield / 12);
    }
}

export function handleJobLoss() {
    if (game.hasQuitJob) return;
    
    game.hasQuitJob = true;
    game.salary = 0;
    
    logEvent('😰 Lost your job due to recession!', 'negative');
    showToast('😰 You lost your job!');
    
    setTimeout(() => {
        if (game.hasQuitJob && !game.escapedRatRace) {
            game.hasQuitJob = false;
            game.salary = Math.round(game.baseSalary * 0.9 * lifestyles[game.lifestyle].salaryMod);
            logEvent('💼 Found new job at reduced salary', 'positive');
            showToast('💼 Found a new job!');
        }
    }, 3);
}

export function handleBankruptcy() {
    logEvent('💸 BANKRUPTCY! Forced to sell assets.', 'negative');
    showToast('💸 Bankruptcy!');
    
    while (game.cash < 0 && game.assets.length > 0) {
        const asset = game.assets[0];
        sellAsset(asset.id);
    }
    
    if (game.cash < 0) {
        game.debts.forEach(d => d.balance = Math.round(d.balance * 0.5));
        game.creditScore = Math.max(300, game.creditScore - 100);
        game.cash = 500;
    }
}

export function updateCreditScore() {
    if (game.debts.length > 0 && game.cash >= 0) {
        game.creditScore += Math.random() < 0.3 ? 1 : 0;
    }
    
    const totalDebt = game.debts.reduce((s, d) => s + d.balance, 0);
    const income = game.salary + getPassiveIncome();
    if (totalDebt > income * 48) {
        game.creditScore -= 1;
    }
    
    game.creditScore += Math.floor(Math.random() * 3) - 1;
    game.creditScore = Math.max(300, Math.min(850, game.creditScore));
}

export function applyAnnualInflation() {
    const baseExpenses = lifestyles[game.lifestyle].expenses;
    const yearsFromStart = game.age - 18;
    game.livingExpenses = Math.round(baseExpenses * Math.pow(1 + 0.03, yearsFromStart));
    
    logEvent(`📊 Annual inflation: expenses now ${formatMoney(game.livingExpenses)}/mo`, 'gold');
}

export function updateJob() {
    if (game.hasQuitJob) return;
    
    game.currentJob.monthsInPosition++;
}

export function updateEducation() {
    if (!game.education.educationInProgress) return;
    
    game.education.monthsRemaining--;
    
    if (game.education.monthsRemaining <= 0) {
        // Education completed
        const edu = education.find(e => e.name === game.education.educationInProgress);
        if (edu) {
            game.financialIQ += edu.iqGain;
            if (!game.education.completedDegrees.includes(edu.degreeId)) {
                game.education.completedDegrees.push(edu.degreeId);
            }
            
            if (edu.degreeType === 'bachelors') {
                game.education.hasBachelors = true;
                game.education.degreeField = edu.name;
                showToast('🎓 Bachelor\'s Degree completed!');
                logEvent(`🎓 Completed ${edu.name}! +${edu.iqGain} IQ`, 'gold');
            } else if (edu.degreeType === 'masters' || edu.degreeType === 'mba') {
                game.education.hasMasters = true;
                game.education.degreeField = edu.name;
                showToast(`${edu.degreeType === 'mba' ? '🎓 MBA completed!' : '🎓 Master\'s Degree completed!'}`);
                logEvent(`🎓 Completed ${edu.name}! +${edu.iqGain} IQ`, 'gold');
            }
        }
        
        game.education.educationInProgress = null;
        game.education.monthsRemaining = 0;
        game.education.startMonth = 0;
    }
}

