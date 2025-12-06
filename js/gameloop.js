// ===========================================
// GAME LOOP
// ===========================================

import { game } from './state.js';
import { economyPhases, phaseTransitions, lifestyles } from './config.js';
import { minorEvents, majorEvents, propertyEvents, businessEvents } from './events.js';
import { formatMoney, getPassiveIncome } from './core.js';
import { showToast, logEvent } from './utils.js';
import { updateUI } from './ui.js';
import { checkWinConditions, checkAchievements, showDeathScreen } from './achievements.js';
import { updateProperty, updateBusiness, updateStock, updateCrypto, handleJobLoss, handleBankruptcy, updateCreditScore, applyAnnualInflation, updateJob, updateEducation } from './gameloop-updates.js';

export function advanceMonth() {
    if (game.deathAge !== null) return; // Don't advance if dead
    game.month++;
    const phase = economyPhases[game.economyPhase];
    
    if (game.month % 12 === 1) {
        game.age++;
        game.raiseReceivedThisYear = false;
        applyAnnualInflation();
        
        // Check for death (random death between ages 70-100)
        if (game.age >= 70 && game.deathAge === null) {
            // Death probability increases with age: 1% at 70, scaling up to ~30% at 100
            const ageFactor = (game.age - 70) / 30; // 0 at 70, 1 at 100
            const deathProbability = 0.01 + (ageFactor * 0.29); // 1% to 30%
            
            if (Math.random() < deathProbability) {
                game.deathAge = game.age;
                handleDeath();
                return; // Stop game loop
            }
        }
    }
    
    updateEconomyCycle();
    
    if (!game.hasQuitJob && game.month >= 13 && !game.raiseReceivedThisYear && Math.random() < 0.2) {
        const raisePercent = 0.03 + Math.random() * 0.07;
        const raise = Math.round(game.baseSalary * raisePercent);
        game.baseSalary += raise;
        game.salary = Math.round(game.baseSalary * lifestyles[game.lifestyle].salaryMod);
        game.raiseReceivedThisYear = true;
        showToast(`💼 You got a raise! +${formatMoney(raise)}/mo`);
        logEvent(`💼 Received a ${formatMoney(raise)}/mo raise!`, 'positive');
    }
    
    if (!game.hasQuitJob && game.economyPhase === 'recession' && Math.random() < phase.jobLossRisk) {
        handleJobLoss();
    }
    
    const salary = game.hasQuitJob ? 0 : game.salary;
    game.cash += salary + getPassiveIncome();
    game.cash -= game.livingExpenses;
    
    game.debts.forEach(d => {
        game.cash -= d.payment;
        const interestCharge = Math.round(d.balance * d.rate / 12);
        const principalPayment = d.payment - interestCharge;
        d.balance = Math.max(0, d.balance - principalPayment);
    });
    game.debts = game.debts.filter(d => d.balance > 0);
    
    game.assets.forEach(a => {
        if (a.type === 'property') updateProperty(a);
        else if (a.type === 'business') updateBusiness(a);
        else if (a.type === 'stock') updateStock(a);
        else if (a.type === 'crypto') updateCrypto(a);
    });
    
    updateJob();
    updateEducation();
    
    processRandomEvents();
    updateCreditScore();
    
    if (game.cash < -10000) handleBankruptcy();
    
    checkWinConditions();
    checkAchievements();
    updateUI();
}

export function updateEconomyCycle() {
    game.economyMonthsInPhase++;
    const phase = economyPhases[game.economyPhase];
    const [minDuration, maxDuration] = phase.duration;
    
    if (game.economyMonthsInPhase >= minDuration) {
        const transitionChance = (game.economyMonthsInPhase - minDuration) / (maxDuration - minDuration);
        if (Math.random() < transitionChance * 0.3) {
            game.economyPhase = phaseTransitions[game.economyPhase];
            game.economyMonthsInPhase = 0;
            
            const phaseMessages = {
                expansion: '📈 Economy entering expansion! Growth ahead.',
                peak: '🔝 Economy at peak! Be cautious.',
                recession: '📉 Recession starting! Opportunities for the prepared.',
                recovery: '🔄 Economy recovering! Good time to invest.'
            };
            
            logEvent(phaseMessages[game.economyPhase], 'gold');
            showToast(phaseMessages[game.economyPhase]);
        }
    }
}

function processRandomEvents() {
    if (Math.random() < 0.2) {
        const event = minorEvents[Math.floor(Math.random() * minorEvents.length)];
        const result = event.effect();
        logEvent(event.text + ' ' + result, event.type);
    }
    
    if (Math.random() < 0.05) {
        const event = majorEvents[Math.floor(Math.random() * majorEvents.length)];
        const result = event.effect();
        logEvent(event.text + ' ' + result, event.type);
    }
    
    const ownedProperties = game.assets.filter(a => a.type === 'property' && !a.isVacant);
    if (ownedProperties.length > 0 && Math.random() < 0.08) {
        const property = ownedProperties[Math.floor(Math.random() * ownedProperties.length)];
        const event = propertyEvents[Math.floor(Math.random() * propertyEvents.length)];
        const result = event.effect(property);
        logEvent(result, event.type);
    }
    
    const ownedBusinesses = game.assets.filter(a => a.type === 'business' && !a.failed);
    if (ownedBusinesses.length > 0 && Math.random() < 0.06) {
        const business = ownedBusinesses[Math.floor(Math.random() * ownedBusinesses.length)];
        const event = businessEvents[Math.floor(Math.random() * businessEvents.length)];
        const result = event.effect(business);
        logEvent(result, event.type);
    }
}

export function skipYear() {
    if (game.deathAge !== null) return; // Don't advance if dead
    for (let i = 0; i < 12; i++) advanceMonth();
}

function handleDeath() {
    logEvent(`💀 You passed away at age ${game.age}. Your legacy lives on...`, 'negative');
    showToast(`💀 You passed away at age ${game.age}`);
    showDeathScreen();
}
