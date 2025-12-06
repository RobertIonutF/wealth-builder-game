// ===========================================
// UI FUNCTIONS
// ===========================================

import { game } from './state.js';
import { formatMoney, capitalizeFirst, getPassiveIncome, getDebtPayments, getTotalExpenses, getCashFlow, getNetWorth, getPropertyNetIncome } from './core.js';
import { renderActions } from './ui-render.js';

export { renderActions };

export function updateUI() {
    const passive = getPassiveIncome();
    const debtPay = getDebtPayments();
    const salary = game.hasQuitJob ? 0 : game.salary;
    const totalInc = salary + passive;
    const totalExp = getTotalExpenses();
    const cf = getCashFlow();
    const nw = getNetWorth();

    document.getElementById('incomeSalary').textContent = game.hasQuitJob ? '$0 (quit)' : formatMoney(game.salary);
    document.getElementById('incomePassive').textContent = formatMoney(passive);
    document.getElementById('incomeTotal').textContent = formatMoney(totalInc);
    document.getElementById('expLiving').textContent = formatMoney(game.livingExpenses);
    document.getElementById('expDebt').textContent = formatMoney(debtPay);
    document.getElementById('expTotal').textContent = formatMoney(totalExp);
    
    const cfEl = document.getElementById('cashFlow');
    cfEl.textContent = (cf >= 0 ? '+' : '') + formatMoney(cf);
    cfEl.className = 'fin-value ' + (cf >= 0 ? 'profit' : 'loss');

    document.getElementById('statCash').textContent = formatMoney(game.cash);
    document.getElementById('statCredit').textContent = game.creditScore;
    document.getElementById('statIQ').textContent = game.financialIQ;
    document.getElementById('statAge').textContent = game.age;

    document.getElementById('headerNetWorth').textContent = formatMoney(nw);
    const hcf = document.getElementById('headerCashFlow');
    hcf.textContent = (cf >= 0 ? '+' : '') + formatMoney(cf);
    hcf.className = 'metric-value ' + (cf >= 0 ? 'profit' : 'loss');
    document.getElementById('headerMonth').textContent = game.month;

    updateEconomyIndicator();
    updateProgressBars(passive, totalExp, nw);
    updateStatistics();

    renderDebts();
    renderAssets();
    renderActions();
}

function updateProgressBars(passive, totalExp, nw) {
    const ratProgress = Math.min(100, (passive / totalExp) * 100);
    const milProgress = Math.min(100, (nw / 1000000) * 100);
    const ultraProgress = Math.min(100, (nw / 10000000) * 100);
    
    document.getElementById('progressRat').textContent = ratProgress.toFixed(0) + '%';
    document.getElementById('barRat').style.width = ratProgress + '%';
    document.getElementById('progressMil').textContent = milProgress.toFixed(1) + '%';
    document.getElementById('barMil').style.width = milProgress + '%';
    document.getElementById('progressUltra').textContent = ultraProgress.toFixed(2) + '%';
    document.getElementById('barUltra').style.width = ultraProgress + '%';
}

function updateStatistics() {
    const assetVal = game.assets.reduce((s, a) => s + (a.value || 0), 0);
    const totalLiab = game.debts.reduce((s, d) => s + d.balance, 0);
    const leverage = game.cash > 0 ? (assetVal / game.cash).toFixed(1) : '0';
    
    document.getElementById('statLeverage').textContent = leverage + 'x';
    document.getElementById('statAssetValue').textContent = formatMoney(assetVal);
    document.getElementById('statLiabilities').textContent = formatMoney(totalLiab);
    
    const assetTypes = new Set(game.assets.map(a => a.type));
    const diversEl = document.getElementById('statDiversification');
    if (assetTypes.size >= 3) {
        diversEl.textContent = '✓ Diversified';
        diversEl.style.color = 'var(--profit)';
    } else if (assetTypes.size >= 2) {
        diversEl.textContent = 'Partial';
        diversEl.style.color = 'var(--gold)';
    } else {
        diversEl.textContent = assetTypes.size === 0 ? 'None' : 'Concentrated';
        diversEl.style.color = 'var(--text-secondary)';
    }
    
    const goodDebt = game.debts.filter(d => d.isGoodDebt).reduce((s, d) => s + d.balance, 0);
    const goodDebtRatio = totalLiab > 0 ? Math.round((goodDebt / totalLiab) * 100) : 0;
    const goodDebtEl = document.getElementById('statGoodDebt');
    goodDebtEl.textContent = goodDebtRatio + '%';
    goodDebtEl.style.color = goodDebtRatio >= 80 ? 'var(--profit)' : goodDebtRatio >= 50 ? 'var(--gold)' : 'var(--text-secondary)';
}

export function updateEconomyIndicator() {
    const indicator = document.getElementById('economyIndicator');
    if (indicator) {
        const phaseColors = {
            expansion: 'var(--profit)',
            peak: 'var(--gold)',
            recession: 'var(--loss)',
            recovery: 'var(--info)'
        };
        const phaseIcons = {
            expansion: '📈',
            peak: '🔝',
            recession: '📉',
            recovery: '🔄'
        };
        indicator.innerHTML = `${phaseIcons[game.economyPhase]} ${capitalizeFirst(game.economyPhase)}`;
        indicator.style.color = phaseColors[game.economyPhase];
    }
}

export function renderDebts() {
    const container = document.getElementById('debtList');
    if (game.debts.length === 0) {
        container.innerHTML = '<p style="color:var(--text-tertiary);font-size:0.8rem;text-align:center">Debt free! 🎉</p>';
        return;
    }
    container.innerHTML = game.debts.map(d => `
        <div class="debt-item" style="border-left:3px solid ${d.isGoodDebt ? 'var(--profit)' : 'var(--loss)'}">
            <div class="debt-info">
                <div class="debt-name">${d.name} <span style="font-size:0.6rem;color:${d.isGoodDebt ? 'var(--profit)' : 'var(--loss)'}">${d.isGoodDebt ? 'GOOD' : 'BAD'}</span></div>
                <div class="debt-details">${(d.rate * 100).toFixed(1)}% APR • ${formatMoney(d.payment)}/mo</div>
            </div>
            <div class="debt-amount">${formatMoney(d.balance)}</div>
        </div>
    `).join('');
}

export function renderAssets() {
    const container = document.getElementById('assetList');
    if (game.assets.length === 0) {
        container.innerHTML = '<p style="color:var(--text-tertiary);font-size:0.8rem;text-align:center;padding:1rem">No assets yet. Start investing!</p>';
        return;
    }
    container.innerHTML = game.assets.map(a => {
        let statusBadge = '';
        let incomeDisplay = '';
        
        if (a.type === 'property') {
            incomeDisplay = formatMoney(getPropertyNetIncome(a));
            if (a.isVacant) statusBadge = '<span style="color:var(--loss);font-size:0.65rem;margin-left:0.25rem">VACANT</span>';
        } else if (a.type === 'business') {
            if (a.failed) {
                statusBadge = '<span style="color:var(--loss);font-size:0.65rem;margin-left:0.25rem">FAILED</span>';
                incomeDisplay = '$0';
            } else {
                incomeDisplay = formatMoney(a.income || 0);
                if (a.canExpand) statusBadge = '<span style="color:var(--gold);font-size:0.65rem;margin-left:0.25rem">EXPAND!</span>';
            }
        } else if (a.type === 'stock') {
            incomeDisplay = formatMoney(a.dividendIncome || 0);
        } else if (a.type === 'crypto') {
            incomeDisplay = formatMoney(a.stakingIncome || 0);
            statusBadge = a.stakingYield ? '<span style="color:var(--info);font-size:0.65rem;margin-left:0.25rem">STAKED</span>' : '';
        }
        
        return `
            <div class="asset-item" onclick="showSellAssetModal(${a.id})" style="cursor:pointer">
                <div class="asset-icon ${a.type}">${a.type === 'property' ? '🏠' : a.type === 'business' ? '🏢' : a.type === 'crypto' ? '🪙' : '📈'}</div>
                <div class="asset-info">
                    <div class="asset-name">${a.name}${statusBadge}</div>
                    <div class="asset-details">${formatMoney(a.value)} • +${incomeDisplay}/mo</div>
                </div>
            </div>
        `;
    }).join('');
}
