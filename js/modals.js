// ===========================================
// MODAL FUNCTIONS - Businesses & Stocks
// ===========================================

import { game } from './state.js';
import { economyPhases, businesses, stocks, cryptocurrencies } from './config.js';
import { formatMoney, capitalizeFirst } from './core.js';
import { showModal, closeModal, showToast, logEvent } from './utils.js';
import { checkAchievements } from './achievements.js';
import { updateUI } from './ui.js';

// Re-export property modals
export { showPropertyModal, buyProperty } from './modals-property.js';

export function showBusinessModal(name) {
    const b = businesses.find(x => x.name === name);
    const phase = economyPhases[game.economyPhase];
    const adjustedIncome = Math.round(b.baseIncome * phase.businessMod);
    const effectiveRisk = Math.round(b.failureRisk * 100 * (game.economyPhase === 'recession' ? 1.5 : 1));
    
    showModal(`Start ${b.name}`, `
        <div class="modal-section">
            <div class="modal-label">Investment Details</div>
            <div class="modal-row"><span>Startup Cost</span><span>${formatMoney(b.price)}</span></div>
            <div class="modal-row"><span>Monthly Income</span><span style="color:var(--profit)">+${formatMoney(adjustedIncome)}</span></div>
            <div class="modal-row"><span>Annual Growth</span><span>${(b.growth * 100).toFixed(0)}%</span></div>
        </div>
        <div class="modal-section">
            <div class="modal-label">Risk Assessment</div>
            <div class="modal-row"><span>Failure Risk</span><span style="color:${effectiveRisk > 15 ? 'var(--loss)' : 'var(--text-secondary)'}">${effectiveRisk}% per year</span></div>
            <div class="modal-row"><span>Economy Impact</span><span>${capitalizeFirst(game.economyPhase)}</span></div>
        </div>
        <div class="modal-tip">💡 <strong>Rich Dad Tip:</strong> Businesses grow income over time, but can fail! Diversify to reduce risk. ${game.hasQuitJob ? 'Self-employed bonus: +10% income!' : 'Quit your job for +10% business income.'}</div>
    `, () => buyBusiness(name));
}

export function buyBusiness(name) {
    const b = businesses.find(x => x.name === name);
    if (game.cash < b.price) {
        showToast('Not enough cash!');
        closeModal();
        return;
    }
    
    const phase = economyPhases[game.economyPhase];
    const adjustedIncome = Math.round(b.baseIncome * phase.businessMod);
    
    game.cash -= b.price;
    game.assets.push({
        id: game.nextAssetId++,
        name: b.name,
        type: 'business',
        value: b.price,
        purchasePrice: b.price,
        income: adjustedIncome,
        baseIncome: b.baseIncome,
        growth: b.growth,
        failureRisk: b.failureRisk,
        failed: false,
        canExpand: false,
        monthsOwned: 0
    });
    closeModal();
    showToast(`Started ${b.name}!`);
    logEvent(`🏢 Started ${b.name}`, 'positive');
    checkAchievements();
    updateUI();
}

export function showStockModal(name) {
    const s = stocks.find(x => x.name === name);
    const maxBuy = Math.floor(game.cash / s.minBuy) * s.minBuy;
    const marketCondition = game.economyPhase === 'recession' ? 'Bear Market - Buy Low!' : 
                           game.economyPhase === 'expansion' ? 'Bull Market' : 
                           game.economyPhase === 'peak' ? 'Market Peak - Caution!' : 'Recovering';
    
    showModal(`Invest in ${s.name}`, `
        <div class="modal-section">
            <div class="modal-label">Investment Amount</div>
            <input type="range" id="stockAmount" min="${s.minBuy}" max="${Math.max(s.minBuy, maxBuy)}" step="${Math.min(500, s.minBuy)}" value="${s.minBuy}" oninput="updateStockPreview('${name}')">
            <div class="slider-value" id="stockValue">$${s.minBuy.toLocaleString()}</div>
        </div>
        <div class="modal-section">
            <div class="modal-label">Expected Returns</div>
            <div class="modal-row"><span>Avg Annual Return</span><span>${(s.returnRate * 100).toFixed(0)}%</span></div>
            <div class="modal-row"><span>Volatility</span><span style="color:${s.volatility > 0.2 ? 'var(--loss)' : 'var(--text-secondary)'}">${(s.volatility * 100).toFixed(0)}%</span></div>
            ${s.dividend ? `<div class="modal-row"><span>Dividend Yield</span><span style="color:var(--profit)">${(s.dividend * 100).toFixed(0)}%</span></div>` : ''}
            ${s.dividend ? `<div class="modal-row"><span>Monthly Dividend</span><span id="stockDividend" style="color:var(--profit)">+${formatMoney(Math.round(s.minBuy * s.dividend / 12))}</span></div>` : ''}
        </div>
        <div class="modal-section">
            <div class="modal-label">Market Conditions</div>
            <div class="modal-row"><span>Current Phase</span><span>${marketCondition}</span></div>
        </div>
        <div class="modal-tip">💡 <strong>Rich Dad Tip:</strong> ${s.dividend ? 'Dividend stocks provide passive income!' : 'Growth stocks are volatile - buy in recessions, sell at peaks!'}</div>
    `, () => buyStock(name));
}

export function updateStockPreview(name) {
    const s = stocks.find(x => x.name === name);
    const amount = parseInt(document.getElementById('stockAmount').value);
    document.getElementById('stockValue').textContent = '$' + amount.toLocaleString();
    if (s.dividend && document.getElementById('stockDividend')) {
        document.getElementById('stockDividend').textContent = '+' + formatMoney(Math.round(amount * s.dividend / 12));
    }
}

export function buyStock(name) {
    const s = stocks.find(x => x.name === name);
    const amount = parseInt(document.getElementById('stockAmount').value);
    if (game.cash < amount) {
        showToast('Not enough cash!');
        closeModal();
        return;
    }
    const dividendIncome = s.dividend ? Math.round(amount * s.dividend / 12) : 0;
    game.cash -= amount;
    
    const existingStock = game.assets.find(a => a.type === 'stock' && a.name === s.name);
    if (existingStock) {
        existingStock.value += amount;
        existingStock.costBasis += amount;
        existingStock.dividendIncome = s.dividend ? Math.round(existingStock.value * s.dividend / 12) : 0;
    } else {
        game.assets.push({
            id: game.nextAssetId++,
            name: s.name,
            type: 'stock',
            value: amount,
            costBasis: amount,
            dividendIncome: dividendIncome,
            returnRate: s.returnRate,
            volatility: s.volatility || 0,
            dividend: s.dividend || 0,
            monthsHeld: 0
        });
    }
    
    closeModal();
    showToast(`Invested ${formatMoney(amount)} in ${s.name}!`);
    logEvent(`📈 Invested ${formatMoney(amount)} in ${s.name}`, 'positive');
    updateUI();
}

export function showCryptoModal(name) {
    const c = cryptocurrencies.find(x => x.name === name);
    const maxBuy = Math.floor(game.cash / c.minBuy) * c.minBuy;
    const stakingInfo = c.stakingYield ? `${(c.stakingYield * 100).toFixed(1)}% staking` : 'No staking yield';
    
    showModal(`Buy ${c.name}`, `
        <div class="modal-section">
            <div class="modal-label">Investment Amount</div>
            <input type="range" id="cryptoAmount" min="${c.minBuy}" max="${Math.max(c.minBuy, maxBuy)}" step="${Math.min(500, c.minBuy)}" value="${c.minBuy}" oninput="updateCryptoPreview('${name}')">
            <div class="slider-value" id="cryptoValue">$${c.minBuy.toLocaleString()}</div>
        </div>
        <div class="modal-section">
            <div class="modal-label">Asset Profile</div>
            <div class="modal-row"><span>Expected Annual Return</span><span>${(c.returnRate * 100).toFixed(0)}%</span></div>
            <div class="modal-row"><span>Volatility</span><span style="color:${c.volatility > 0.3 ? 'var(--loss)' : 'var(--text-secondary)'}">${(c.volatility * 100).toFixed(0)}%</span></div>
            <div class="modal-row"><span>Staking</span><span style="color:${c.stakingYield ? 'var(--profit)' : 'var(--text-secondary)'}">${stakingInfo}</span></div>
        </div>
        <div class="modal-tip">💡 <strong>Rich Dad Tip:</strong> Crypto is volatile. Stake to earn passive yield and size positions carefully.</div>
    `, () => buyCrypto(name));
}

export function updateCryptoPreview(name) {
    const c = cryptocurrencies.find(x => x.name === name);
    const amount = parseInt(document.getElementById('cryptoAmount').value);
    document.getElementById('cryptoValue').textContent = '$' + amount.toLocaleString();
    if (c.stakingYield && document.getElementById('cryptoValue')) {
        // nothing additional to render beyond amount; leave hook for future details
    }
}

export function buyCrypto(name) {
    const c = cryptocurrencies.find(x => x.name === name);
    const amount = parseInt(document.getElementById('cryptoAmount').value);
    if (game.cash < amount) {
        showToast('Not enough cash!');
        closeModal();
        return;
    }
    
    const stakingIncome = c.stakingYield ? Math.round(amount * c.stakingYield / 12) : 0;
    game.cash -= amount;
    
    const existing = game.assets.find(a => a.type === 'crypto' && a.name === c.name);
    if (existing) {
        existing.value += amount;
        existing.costBasis += amount;
        existing.stakingIncome = c.stakingYield ? Math.round(existing.value * c.stakingYield / 12) : 0;
    } else {
        game.assets.push({
            id: game.nextAssetId++,
            name: c.name,
            symbol: c.symbol,
            type: 'crypto',
            value: amount,
            costBasis: amount,
            stakingIncome: stakingIncome,
            returnRate: c.returnRate,
            volatility: c.volatility,
            stakingYield: c.stakingYield || 0,
            monthsHeld: 0
        });
    }
    
    closeModal();
    showToast(`Bought ${c.name} for ${formatMoney(amount)}!`);
    logEvent(`🪙 Bought ${c.name}`, 'positive');
    updateUI();
}
