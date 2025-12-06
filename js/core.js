// ===========================================
// CORE FUNCTIONS
// ===========================================

import { game } from './state.js';
import { economyPhases } from './config.js';

export function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatMoney(n) {
    if (Math.abs(n) >= 1000000) return '$' + (n/1000000).toFixed(1) + 'M';
    if (Math.abs(n) >= 1000) return '$' + (n/1000).toFixed(0) + 'K';
    return '$' + Math.round(n).toLocaleString();
}

export function getPassiveIncome() {
    let income = 0;
    game.assets.forEach(a => {
        if (a.type === 'property') {
            income += getPropertyNetIncome(a);
        } else if (a.type === 'business') {
            if (!a.failed) {
                let businessIncome = a.income || 0;
                if (game.hasQuitJob) businessIncome *= 1.1;
                income += businessIncome;
            }
        } else if (a.type === 'stock') {
            income += a.dividendIncome || 0;
        } else if (a.type === 'crypto') {
            income += a.stakingIncome || 0;
        }
    });
    return Math.round(income);
}

export function getPropertyNetIncome(property) {
    if (property.isVacant) return 0;
    const phase = economyPhases[game.economyPhase];
    const grossRent = property.grossRent * phase.rentMod;
    const monthlyExpenses = (property.value * (property.maintenanceRate + property.taxRate + property.insuranceRate)) / 12;
    return Math.round(grossRent - monthlyExpenses);
}

export function getDebtPayments() {
    return game.debts.reduce((sum, d) => sum + d.payment, 0);
}

export function getTotalExpenses() {
    return game.livingExpenses + getDebtPayments();
}

export function getCashFlow() {
    const salary = game.hasQuitJob ? 0 : game.salary;
    return salary + getPassiveIncome() - getTotalExpenses();
}

export function getNetWorth() {
    const assetValue = game.assets.reduce((sum, a) => sum + (a.value || 0), 0);
    const debtValue = game.debts.reduce((sum, d) => sum + d.balance, 0);
    return game.cash + assetValue - debtValue;
}

export function getDiversificationBonus() {
    const types = new Set(game.assets.map(a => a.type));
    if (types.size >= 3) return 0.05;
    if (types.size >= 2) return 0.02;
    return 0;
}

export function getConcentrationPenalty() {
    if (game.assets.length === 0) return 0;
    const typeValues = {};
    let totalValue = 0;
    game.assets.forEach(a => {
        typeValues[a.type] = (typeValues[a.type] || 0) + a.value;
        totalValue += a.value;
    });
    const maxConcentration = Math.max(...Object.values(typeValues)) / totalValue;
    if (maxConcentration > 0.8) return -0.05;
    return 0;
}

export function getCurrentInterestRate() {
    const phase = economyPhases[game.economyPhase];
    return game.baseInterestRate * phase.rateMod;
}

export function calculateMortgagePayment(principal, annualRate, months) {
    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return principal / months;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

export function calculatePropertyNetIncome(p) {
    const phase = economyPhases[game.economyPhase];
    const adjustedPrice = p.price * phase.propertyMod;
    const grossRent = p.grossRent * phase.rentMod;
    const monthlyExpenses = (adjustedPrice * (p.maintenanceRate + p.taxRate + p.insuranceRate)) / 12;
    const loan = adjustedPrice * 0.8;
    const loanPayment = calculateMortgagePayment(loan, getCurrentInterestRate() + 0.005, 360);
    return Math.round(grossRent - monthlyExpenses - loanPayment);
}

export function calculateLoanRate() {
    if (game.creditScore >= 750) return 0.08;
    if (game.creditScore >= 700) return 0.09;
    if (game.creditScore >= 650) return 0.11;
    return 0.12;
}

export function calculateMaxLoan() {
    const baseMultiplier = 3;
    const creditBonus = Math.max(0, (game.creditScore - 650) / 100) * 3;
    const maxMultiplier = Math.min(6, baseMultiplier + creditBonus);
    const totalIncome = game.salary + getPassiveIncome();
    return Math.round(totalIncome * maxMultiplier);
}

export function initializeEconomy() {
    game.economyPhase = 'expansion';
    game.economyMonthsInPhase = 0;
    game.baseInterestRate = 0.05;
}

