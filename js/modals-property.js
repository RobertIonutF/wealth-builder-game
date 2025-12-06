// ===========================================
// MODAL FUNCTIONS - Properties
// ===========================================

import { game } from './state.js';
import { economyPhases, properties } from './config.js';
import { formatMoney, capitalizeFirst, getCurrentInterestRate, calculateMortgagePayment } from './core.js';
import { showModal, closeModal, showToast, logEvent } from './utils.js';
import { checkAchievements } from './achievements.js';
import { updateUI } from './ui.js';

export function showPropertyModal(name) {
    const p = properties.find(x => x.name === name);
    const phase = economyPhases[game.economyPhase];
    const adjustedPrice = Math.round(p.price * phase.propertyMod);
    const down = adjustedPrice * 0.2;
    const loan = adjustedPrice * 0.8;
    const loanRate = getCurrentInterestRate() + 0.005;
    const loanPayment = Math.round(calculateMortgagePayment(loan, loanRate, 360));
    const grossRent = Math.round(p.grossRent * phase.rentMod);
    const monthlyExpenses = Math.round((adjustedPrice * (p.maintenanceRate + p.taxRate + p.insuranceRate)) / 12);
    const netIncome = grossRent - monthlyExpenses - loanPayment;
    const vacancyRisk = Math.round(p.vacancyRate * phase.vacancyMod * 100);
    
    showModal(`Buy ${p.name}`, `
        <div class="modal-section">
            <div class="modal-label">Purchase Details (${capitalizeFirst(game.economyPhase)} Market)</div>
            <div class="modal-row"><span>Property Price</span><span>${formatMoney(adjustedPrice)}</span></div>
            <div class="modal-row"><span>Down Payment (20%)</span><span>${formatMoney(down)}</span></div>
            <div class="modal-row"><span>Loan Amount</span><span>${formatMoney(loan)}</span></div>
            <div class="modal-row"><span>Mortgage Rate</span><span>${(loanRate * 100).toFixed(2)}%</span></div>
        </div>
        <div class="modal-section">
            <div class="modal-label">Monthly Cash Flow</div>
            <div class="modal-row"><span>Gross Rent</span><span style="color:var(--profit)">+${formatMoney(grossRent)}</span></div>
            <div class="modal-row"><span>Operating Expenses</span><span style="color:var(--loss)">-${formatMoney(monthlyExpenses)}</span></div>
            <div class="modal-row"><span>Mortgage Payment</span><span style="color:var(--loss)">-${formatMoney(loanPayment)}</span></div>
            <div class="modal-row" style="font-weight:600"><span>Net Income</span><span style="color:${netIncome >= 0 ? 'var(--profit)' : 'var(--loss)'}">${netIncome >= 0 ? '+' : ''}${formatMoney(netIncome)}</span></div>
        </div>
        <div class="modal-section">
            <div class="modal-label">Risks</div>
            <div class="modal-row"><span>Vacancy Risk</span><span>${vacancyRisk}% per year</span></div>
            <div class="modal-row"><span>Annual Appreciation</span><span>${(p.appreciation * 100).toFixed(1)}%</span></div>
        </div>
        <div class="modal-tip">💡 <strong>Rich Dad Tip:</strong> You're using leverage! Control a ${formatMoney(adjustedPrice)} asset with only ${formatMoney(down)}. Property loans amortize - you build equity!</div>
    `, () => buyProperty(name));
}

export function buyProperty(name) {
    const p = properties.find(x => x.name === name);
    const phase = economyPhases[game.economyPhase];
    const adjustedPrice = Math.round(p.price * phase.propertyMod);
    const down = adjustedPrice * 0.2;
    
    if (game.cash < down) {
        showToast('Not enough cash for down payment!');
        closeModal();
        return;
    }
    
    const loan = adjustedPrice * 0.8;
    const loanRate = getCurrentInterestRate() + 0.005;
    const loanPayment = Math.round(calculateMortgagePayment(loan, loanRate, 360));
    
    game.cash -= down;
    
    const assetId = game.nextAssetId++;
    
    game.assets.push({
        id: assetId,
        name: p.name,
        type: 'property',
        value: adjustedPrice,
        purchasePrice: adjustedPrice,
        grossRent: p.grossRent,
        appreciation: p.appreciation,
        maintenanceRate: p.maintenanceRate,
        taxRate: p.taxRate,
        insuranceRate: p.insuranceRate,
        vacancyRate: p.vacancyRate,
        isVacant: false,
        vacantMonths: 0,
        loanId: `property-loan-${assetId}`
    });
    
    game.debts.push({
        name: `${p.name} Mortgage`,
        balance: loan,
        rate: loanRate,
        payment: loanPayment,
        type: 'property-loan',
        isGoodDebt: true,
        linkedAssetId: assetId
    });
    
    closeModal();
    showToast(`Purchased ${p.name}!`);
    logEvent(`🏠 Bought ${p.name} for ${formatMoney(down)} down`, 'positive');
    checkAchievements();
    updateUI();
}

