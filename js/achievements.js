// ===========================================
// WIN CONDITIONS & ACHIEVEMENTS
// ===========================================

import { game } from './state.js';
import { formatMoney, getPassiveIncome, getTotalExpenses, getNetWorth } from './core.js';
import { showToast, logEvent } from './utils.js';

export function checkWinConditions() {
    const passive = getPassiveIncome();
    const expenses = getTotalExpenses();
    const nw = getNetWorth();
    
    if (!game.milestones.ratRaceEscaped && passive >= expenses) {
        game.milestones.ratRaceEscaped = true;
        game.escapedRatRace = true;
        const yearsToEscape = game.age - 18;
        const rating = yearsToEscape <= 10 ? '🥇 GOLD' : yearsToEscape <= 20 ? '🥈 SILVER' : '🥉 BRONZE';
        showToast(`🐀 Escaped the Rat Race! ${rating}`);
        logEvent(`🎉 ESCAPED THE RAT RACE in ${yearsToEscape} years! ${rating}`, 'gold');
    }
    
    if (!game.milestones.financialIndependence && passive >= expenses * 2) {
        game.milestones.financialIndependence = true;
        game.financiallyIndependent = true;
        showToast('💎 Financial Independence! Passive = 2x expenses!');
        logEvent('💎 Achieved Financial Independence!', 'gold');
    }
    
    if (!game.milestones.millionaire && nw >= 1000000) {
        game.milestones.millionaire = true;
        game.isMillionaire = true;
        showToast('🎩 MILLIONAIRE! $1M Net Worth!');
        logEvent('🎩 Became a MILLIONAIRE!', 'gold');
    }
    
    if (!game.milestones.generationalWealth && nw >= 10000000) {
        game.milestones.generationalWealth = true;
        showWinScreen('Generational Wealth', 'You achieved $10M+ net worth! True financial freedom!');
    }
    
    if (game.milestones.millionaire && game.milestones.financialIndependence && !document.getElementById('winScreen').classList.contains('active')) {
        showWinScreen('Wealthy & Free', 'Millionaire with passive income covering 2x expenses!');
    }
}

export function showWinScreen(title, message) {
    const yearsPlayed = game.age - 18;
    const rating = yearsPlayed <= 10 ? '🥇 GOLD' : yearsPlayed <= 20 ? '🥈 SILVER' : yearsPlayed <= 30 ? '🥉 BRONZE' : '⭐ COMPLETE';
    
    document.getElementById('winMessage').textContent = message;
    document.getElementById('winStats').innerHTML = `
        <div class="win-stat"><div class="win-stat-label">Net Worth</div><div class="win-stat-value" style="color:var(--gold)">${formatMoney(getNetWorth())}</div></div>
        <div class="win-stat"><div class="win-stat-label">Passive Income</div><div class="win-stat-value" style="color:var(--profit)">${formatMoney(getPassiveIncome())}/mo</div></div>
        <div class="win-stat"><div class="win-stat-label">Time Taken</div><div class="win-stat-value">${yearsPlayed} years</div></div>
        <div class="win-stat"><div class="win-stat-label">Rating</div><div class="win-stat-value">${rating}</div></div>
        <div class="win-stat"><div class="win-stat-label">Final Age</div><div class="win-stat-value">${game.age}</div></div>
        <div class="win-stat"><div class="win-stat-label">Properties</div><div class="win-stat-value">${game.assets.filter(a => a.type === 'property').length}</div></div>
        <div class="win-stat"><div class="win-stat-label">Businesses</div><div class="win-stat-value">${game.assets.filter(a => a.type === 'business' && !a.failed).length}</div></div>
        <div class="win-stat"><div class="win-stat-label">Financial IQ</div><div class="win-stat-value">${game.financialIQ}</div></div>
    `;
    document.getElementById('winScreen').classList.add('active');
}

export function showDeathScreen() {
    const yearsPlayed = game.age - 18;
    const rating = yearsPlayed <= 10 ? '🥇 GOLD' : yearsPlayed <= 20 ? '🥈 SILVER' : yearsPlayed <= 30 ? '🥉 BRONZE' : '⭐ COMPLETE';
    
    const winScreen = document.getElementById('winScreen');
    const winIcon = winScreen.querySelector('.win-icon');
    const winTitle = winScreen.querySelector('.win-title');
    
    winIcon.textContent = '💀';
    winTitle.textContent = 'Your Legacy Lives On';
    document.getElementById('winMessage').textContent = `You passed away at age ${game.age}. Your financial legacy lives on through your assets and achievements.`;
    document.getElementById('winStats').innerHTML = `
        <div class="win-stat"><div class="win-stat-label">Net Worth</div><div class="win-stat-value" style="color:var(--gold)">${formatMoney(getNetWorth())}</div></div>
        <div class="win-stat"><div class="win-stat-label">Passive Income</div><div class="win-stat-value" style="color:var(--profit)">${formatMoney(getPassiveIncome())}/mo</div></div>
        <div class="win-stat"><div class="win-stat-label">Years Played</div><div class="win-stat-value">${yearsPlayed} years</div></div>
        <div class="win-stat"><div class="win-stat-label">Rating</div><div class="win-stat-value">${rating}</div></div>
        <div class="win-stat"><div class="win-stat-label">Age at Death</div><div class="win-stat-value">${game.age}</div></div>
        <div class="win-stat"><div class="win-stat-label">Properties</div><div class="win-stat-value">${game.assets.filter(a => a.type === 'property').length}</div></div>
        <div class="win-stat"><div class="win-stat-label">Businesses</div><div class="win-stat-value">${game.assets.filter(a => a.type === 'business' && !a.failed).length}</div></div>
        <div class="win-stat"><div class="win-stat-label">Financial IQ</div><div class="win-stat-value">${game.financialIQ}</div></div>
    `;
    winScreen.classList.add('active');
}

export function checkAchievements() {
    const checks = [
        { id: 'first_property', cond: () => game.assets.some(a => a.type === 'property'), msg: '🏠 First Property!' },
        { id: 'first_business', cond: () => game.assets.some(a => a.type === 'business'), msg: '🏢 First Business!' },
        { id: 'first_stock', cond: () => game.assets.some(a => a.type === 'stock'), msg: '📈 First Investment!' },
        { id: 'first_crypto', cond: () => game.assets.some(a => a.type === 'crypto'), msg: '🪙 First Crypto!' },
        { id: 'debt_free', cond: () => game.debts.filter(d => !d.isGoodDebt).length === 0, msg: '✅ Bad Debt Free!' },
        { id: 'all_debt_free', cond: () => game.debts.length === 0, msg: '🌟 Completely Debt Free!' },
        { id: 'high_credit', cond: () => game.creditScore >= 750, msg: '📊 Excellent Credit!' },
        { id: 'perfect_credit', cond: () => game.creditScore >= 800, msg: '💯 Perfect Credit!' },
        { id: 'iq_50', cond: () => game.financialIQ >= 50, msg: '🧠 Financial Expert!' },
        { id: 'iq_100', cond: () => game.financialIQ >= 100, msg: '🎓 Financial Genius!' },
        { id: 'diversified', cond: () => {
            const types = new Set(game.assets.map(a => a.type));
            return types.size >= 3;
        }, msg: '🌈 Diversified Portfolio!' },
        { id: 'self_employed', cond: () => game.hasQuitJob && game.escapedRatRace, msg: '🚀 Full-Time Entrepreneur!' },
        { id: 'recession_survivor', cond: () => game.economyPhase === 'recovery' && game.assets.length > 0, msg: '💪 Recession Survivor!' },
        { id: 'real_estate_mogul', cond: () => game.assets.filter(a => a.type === 'property').length >= 5, msg: '🏘️ Real Estate Mogul!' },
        { id: 'business_empire', cond: () => game.assets.filter(a => a.type === 'business' && !a.failed).length >= 3, msg: '👔 Business Empire!' },
        { id: 'first_job', cond: () => !game.hasQuitJob && game.currentJob.monthsInPosition > 0, msg: '💼 Got Your First Job!' },
        { id: 'bachelors_degree', cond: () => game.education.hasBachelors, msg: '🎓 Bachelor\'s Degree!' },
        { id: 'masters_degree', cond: () => game.education.hasMasters, msg: '🎓 Master\'s Degree!' },
        { id: 'first_promotion', cond: () => game.jobHistory.length > 0 || (!game.hasQuitJob && game.currentJob.level > 0), msg: '📈 First Promotion!' },
        { id: 'manager_level', cond: () => !game.hasQuitJob && game.currentJob.level >= 4, msg: '👔 Manager Level!' },
        { id: 'executive_level', cond: () => !game.hasQuitJob && game.currentJob.level >= 6, msg: '🏆 Executive Level!' },
        { id: 'c_level', cond: () => !game.hasQuitJob && game.currentJob.level >= 7, msg: '👑 C-Level Executive!' }
    ];
    
    checks.forEach(c => {
        if (!game.achievements.includes(c.id) && c.cond()) {
            game.achievements.push(c.id);
            showToast(c.msg);
            logEvent(`🏆 Achievement: ${c.msg}`, 'gold');
        }
    });
}

