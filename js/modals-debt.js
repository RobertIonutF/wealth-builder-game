// ===========================================
// MODAL FUNCTIONS - Debt Management
// ===========================================

import { game } from './state.js';
import { formatMoney, calculateLoanRate, calculateMaxLoan } from './core.js';
import { showModal, closeModal, showToast, logEvent } from './utils.js';
import { checkAchievements } from './achievements.js';
import { updateUI } from './ui.js';

export function showPayDebtModal() {
    if (game.debts.length === 0) {
        showToast('No debts to pay!');
        return;
    }
    const options = game.debts.map(d => `<option value="${d.name}">${d.name} - ${formatMoney(d.balance)} @ ${(d.rate*100).toFixed(1)}%</option>`).join('');
    showModal('Pay Off Debt', `
        <div class="modal-section">
            <div class="modal-label">Select Debt</div>
            <select id="debtSelect" style="width:100%;padding:0.5rem;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px;color:var(--text-primary)">${options}</select>
        </div>
        <div class="modal-section">
            <div class="modal-label">Payment Amount</div>
            <input type="range" id="payAmount" min="100" max="${game.cash}" step="100" value="${Math.min(1000, game.cash)}" oninput="document.getElementById('payValue').textContent='$'+this.value.toLocaleString()">
            <div class="slider-value" id="payValue">$${Math.min(1000, game.cash).toLocaleString()}</div>
        </div>
        <div class="modal-tip">💡 <strong>Rich Dad Tip:</strong> Pay off high-interest debt first!</div>
    `, payDebt);
}

export function payDebt() {
    const debtName = document.getElementById('debtSelect').value;
    const amount = parseInt(document.getElementById('payAmount').value);
    const debt = game.debts.find(d => d.name === debtName);
    
    if (amount > game.cash) {
        showToast('Not enough cash!');
        closeModal();
        return;
    }
    
    game.cash -= amount;
    debt.balance -= amount;
    
    if (debt.balance <= 0) {
        game.debts = game.debts.filter(d => d.name !== debtName);
        showToast(`${debtName} paid off!`);
        logEvent(`✅ Paid off ${debtName}!`, 'positive');
        game.creditScore = Math.min(850, game.creditScore + 15);
    } else {
        showToast(`Paid ${formatMoney(amount)} on ${debtName}`);
        logEvent(`💳 Paid ${formatMoney(amount)} on ${debtName}`, 'gold');
    }
    
    closeModal();
    checkAchievements();
    updateUI();
}

export function showRefinanceModal() {
    const eligible = game.debts.filter(d => d.rate > 0.04);
    if (eligible.length === 0) {
        showToast('No debts eligible for refinance');
        return;
    }
    const options = eligible.map(d => `<option value="${d.name}">${d.name} - ${(d.rate*100).toFixed(1)}% → ${((d.rate-0.015)*100).toFixed(1)}%</option>`).join('');
    showModal('Refinance Debt', `
        <div class="modal-section">
            <div class="modal-label">Select Debt to Refinance</div>
            <select id="refiSelect" style="width:100%;padding:0.5rem;background:var(--bg-elevated);border:1px solid var(--border);border-radius:8px;color:var(--text-primary)">${options}</select>
        </div>
        <div class="modal-tip">💡 Your good credit score qualifies you for 1.5% lower rates!</div>
    `, refinanceDebt);
}

export function refinanceDebt() {
    const debtName = document.getElementById('refiSelect').value;
    const debt = game.debts.find(d => d.name === debtName);
    debt.rate -= 0.015;
    debt.payment = Math.round(debt.payment * 0.9);
    closeModal();
    showToast(`Refinanced ${debtName}!`);
    logEvent(`📉 Refinanced ${debtName} to ${(debt.rate*100).toFixed(1)}%`, 'gold');
    updateUI();
}

export function showBankLoanModal() {
    if (game.creditScore < 650) {
        showToast('Credit score too low for bank loan!');
        return;
    }
    
    const maxLoan = calculateMaxLoan();
    const rate = calculateLoanRate();
    const minLoan = 1000;
    const defaultLoan = Math.min(5000, maxLoan);
    
    const monthlyRate = rate / 12;
    const numPayments = 60;
    const defaultPayment = Math.round((defaultLoan * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1));
    
    showModal('🏦 Bank Loan', `
        <div class="modal-section">
            <div class="modal-label">Your Loan Terms</div>
            <div class="modal-row"><span>Credit Score</span><span>${game.creditScore}</span></div>
            <div class="modal-row"><span>Interest Rate (APR)</span><span>${(rate * 100).toFixed(1)}%</span></div>
            <div class="modal-row"><span>Max Loan Amount</span><span>${formatMoney(maxLoan)}</span></div>
            <div class="modal-row"><span>Loan Term</span><span>5 years (60 months)</span></div>
        </div>
        <div class="modal-section">
            <div class="modal-label">Loan Amount</div>
            <input type="range" id="loanAmount" min="${minLoan}" max="${maxLoan}" step="500" value="${defaultLoan}" oninput="updateLoanPayment()">
            <div class="slider-value" id="loanValue">$${defaultLoan.toLocaleString()}</div>
        </div>
        <div class="modal-section">
            <div class="modal-label">Monthly Payment</div>
            <div class="slider-value" id="loanPayment" style="color:var(--loss)">$${defaultPayment.toLocaleString()}/mo</div>
        </div>
        <div class="modal-tip">💡 <strong>Rich Dad Tip:</strong> Use this cash to buy income-producing assets. Good debt makes you money!</div>
    `, takeBankLoan);
}

export function updateLoanPayment() {
    const amount = parseInt(document.getElementById('loanAmount').value);
    const rate = calculateLoanRate();
    const monthlyRate = rate / 12;
    const numPayments = 60;
    const payment = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1));
    
    document.getElementById('loanValue').textContent = '$' + amount.toLocaleString();
    document.getElementById('loanPayment').textContent = '$' + payment.toLocaleString() + '/mo';
}

export function takeBankLoan() {
    const amount = parseInt(document.getElementById('loanAmount').value);
    const rate = calculateLoanRate();
    const monthlyRate = rate / 12;
    const numPayments = 60;
    const payment = Math.round((amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1));
    
    game.cash += amount;
    
    game.debts.push({
        name: 'Bank Loan',
        balance: amount,
        rate: rate,
        payment: payment,
        type: 'bank',
        isGoodDebt: false
    });
    
    game.creditScore = Math.max(300, game.creditScore - 5);
    
    closeModal();
    showToast(`Received ${formatMoney(amount)} bank loan!`);
    logEvent(`🏦 Took ${formatMoney(amount)} bank loan at ${(rate*100).toFixed(1)}%`, 'gold');
    updateUI();
}

