// ===========================================
// MODAL FUNCTIONS - Education, Selling, Lifestyle
// ===========================================

import { game } from './state.js';
import { economyPhases, lifestyles, education } from './config.js';
import { formatMoney, capitalizeFirst, getPassiveIncome } from './core.js';
import { showModal, closeModal, showToast, logEvent } from './utils.js';
import { updateUI } from './ui.js';

function hasDegree(id) {
    return game.education.completedDegrees && game.education.completedDegrees.includes(id);
}

function degreeName(id) {
    const match = education.find(e => e.degreeId === id);
    if (match) return match.name;
    return id.replace(/_/g, ' ');
}

export function showEducationModal(name) {
    const e = education.find(x => x.name === name);
    
    // Check if already enrolled in this degree
    if (!e.instant && game.education.educationInProgress && game.education.educationInProgress === name) {
        const monthsRemaining = game.education.monthsRemaining;
        const yearsRemaining = Math.floor(monthsRemaining / 12);
        const monthsLeft = monthsRemaining % 12;
        showModal(`Currently Enrolled: ${e.name}`, `
            <div class="modal-section">
                <div class="modal-label">Enrollment Status</div>
                <div class="modal-row"><span>Time Remaining</span><span>${yearsRemaining > 0 ? yearsRemaining + ' years, ' : ''}${monthsLeft} months</div>
                <div class="modal-row"><span>IQ Gain on Completion</span><span style="color:var(--profit)">+${e.iqGain}</span></div>
            </div>
            <div class="modal-tip">💡 You can quit this program, but you'll lose your progress and won't get a refund!</div>
        `, () => quitEducation());
        return;
    }
    
    // Check if already has this degree
    if (hasDegree(e.degreeId)) {
        showModal(`${e.name}`, `
            <div class="modal-section">
                <div class="modal-label">Already Completed</div>
                <div class="modal-row"><span>Status</span><span style="color:var(--profit)">✅ Completed</span></div>
            </div>
        `);
        return;
    }
    
    // Check requirements
    let requirements = [];
    const prereqs = e.prerequisites || [];
    const missingPrereqs = prereqs.filter(p => !hasDegree(p));
    if (e.requiresAnyBachelors && !game.education.hasBachelors) {
        requirements.push('❌ Any Bachelor\'s Degree required');
    } else if (e.requiresAnyBachelors) {
        requirements.push('✅ Bachelor\'s Degree ready');
    }
    if (prereqs.length > 0) {
        requirements.push(...prereqs.map(p => `${hasDegree(p) ? '✅' : '❌'} Requires ${degreeName(p)}`));
    }
    if (game.education.educationInProgress) {
        requirements.push('❌ Already enrolled in another program');
    }
    
    const hasPrereqs = missingPrereqs.length === 0 && (!e.requiresAnyBachelors || game.education.hasBachelors);
    const canStart = hasPrereqs && !game.education.educationInProgress;
    
    let details = `
        <div class="modal-section">
            <div class="modal-label">Program Details</div>
            <div class="modal-row"><span>Cost</span><span>${formatMoney(e.price)}</span></div>
            <div class="modal-row"><span>IQ Gain</span><span style="color:var(--profit)">+${e.iqGain}</span></div>
    `;
    
    if (!e.instant) {
        const years = Math.floor(e.monthsRequired / 12);
        const months = e.monthsRequired % 12;
        details += `
            <div class="modal-row"><span>Duration</span><span>${years > 0 ? years + ' years, ' : ''}${months} months</span></div>
        `;
    }
    
    details += `</div>`;
    
    if (requirements.length > 0) {
        details += `
            <div class="modal-section">
                <div class="modal-label">Requirements</div>
                ${requirements.map(r => `<div class="modal-row"><span></span><span>${r}</span></div>`).join('')}
            </div>
        `;
    }
    
    details += `<div class="modal-tip">💡 <strong>Rich Dad Tip:</strong> ${e.instant ? 'Instant learning boosts your IQ!' : 'Formal degrees unlock better job opportunities!'}</div>`;
    
    showModal(`${e.name}`, details, canStart ? () => buyEducation(name) : null);
}

export function buyEducation(name) {
    const e = education.find(x => x.name === name);
    const prereqs = e?.prerequisites || [];
    if (!e) return;
    const missingPrereqs = prereqs.filter(p => !game.education.completedDegrees.includes(p));
    if ((e.requiresAnyBachelors && !game.education.hasBachelors) || missingPrereqs.length > 0) {
        showToast('Requirements not met');
        closeModal();
        return;
    }
    if (game.cash < e.price) {
        showToast('Not enough cash!');
        closeModal();
        return;
    }
    
    if (e.instant) {
        // Instant education (books, courses, etc.)
        game.cash -= e.price;
        game.financialIQ += e.iqGain;
        closeModal();
        showToast(`Completed ${e.name}! +${e.iqGain} IQ`);
        logEvent(`📚 Completed ${e.name} (+${e.iqGain} IQ)`, 'gold');
        updateUI();
    } else {
        // Degree program - enroll
        game.cash -= e.price;
        game.education.educationInProgress = name;
        game.education.monthsRemaining = e.monthsRequired;
        game.education.startMonth = game.month;
        
        closeModal();
        showToast(`🎓 Enrolled in ${e.name}!`);
        logEvent(`🎓 Enrolled in ${e.name} (${e.monthsRequired} months)`, 'gold');
        updateUI();
    }
}

export function quitEducation() {
    if (!game.education.educationInProgress) {
        showToast('Not enrolled in any program');
        return;
    }
    
    showModal('Quit Education Program?', `
        <div class="modal-section">
            <div class="modal-label">Warning</div>
            <div class="modal-row"><span>Program</span><span>${game.education.educationInProgress}</span></div>
            <div class="modal-row"><span>Progress Lost</span><span style="color:var(--loss)">All progress will be lost</span></div>
            <div class="modal-row"><span>Refund</span><span style="color:var(--loss)">No refund</span></div>
        </div>
        <div class="modal-tip">⚠️ You can re-enroll later, but you'll have to pay again!</div>
    `, () => {
        game.education.educationInProgress = null;
        game.education.monthsRemaining = 0;
        game.education.startMonth = 0;
        closeModal();
        showToast('Education program quit');
        logEvent(`📚 Quit ${game.education.educationInProgress} program`, 'negative');
        updateUI();
    });
}

export function showSellAssetModal(assetId) {
    const asset = game.assets.find(a => a.id === assetId);
    if (!asset) return;
    
    const phase = economyPhases[game.economyPhase];
    let salePrice, fees, netProceeds, details;
    
    if (asset.type === 'property') {
        const marketValue = Math.round(asset.value * phase.propertyMod);
        fees = Math.round(marketValue * 0.06);
        const linkedDebt = game.debts.find(d => d.linkedAssetId === assetId);
        const debtPayoff = linkedDebt ? linkedDebt.balance : 0;
        netProceeds = marketValue - fees - debtPayoff;
        
        details = `
            <div class="modal-section">
                <div class="modal-label">Sale Details</div>
                <div class="modal-row"><span>Market Value</span><span>${formatMoney(marketValue)}</span></div>
                <div class="modal-row"><span>Realtor Fees (6%)</span><span style="color:var(--loss)">-${formatMoney(fees)}</span></div>
                ${linkedDebt ? `<div class="modal-row"><span>Mortgage Payoff</span><span style="color:var(--loss)">-${formatMoney(debtPayoff)}</span></div>` : ''}
                <div class="modal-row" style="font-weight:600"><span>Net Proceeds</span><span style="color:${netProceeds >= 0 ? 'var(--profit)' : 'var(--loss)'}">${formatMoney(netProceeds)}</span></div>
            </div>
            <div class="modal-section">
                <div class="modal-label">Investment Summary</div>
                <div class="modal-row"><span>Purchase Price</span><span>${formatMoney(asset.purchasePrice)}</span></div>
                <div class="modal-row"><span>Appreciation</span><span style="color:var(--profit)">${formatMoney(asset.value - asset.purchasePrice)}</span></div>
            </div>
        `;
    } else if (asset.type === 'business') {
        if (asset.failed) {
            salePrice = Math.round(asset.value * 0.2);
            fees = 0;
        } else {
            salePrice = Math.round(asset.value * phase.businessMod);
            fees = Math.round(salePrice * 0.05);
        }
        netProceeds = salePrice - fees;
        
        details = `
            <div class="modal-section">
                <div class="modal-label">Sale Details</div>
                <div class="modal-row"><span>Sale Price</span><span>${formatMoney(salePrice)}</span></div>
                ${fees > 0 ? `<div class="modal-row"><span>Broker Fees (5%)</span><span style="color:var(--loss)">-${formatMoney(fees)}</span></div>` : ''}
                <div class="modal-row" style="font-weight:600"><span>Net Proceeds</span><span style="color:var(--profit)">${formatMoney(netProceeds)}</span></div>
            </div>
            ${asset.failed ? '<div class="modal-tip" style="color:var(--loss)">⚠️ Business failed - selling at salvage value</div>' : ''}
        `;
    } else if (asset.type === 'stock') {
        const marketValue = asset.value;
        const gain = marketValue - asset.costBasis;
        const taxRate = asset.monthsHeld < 12 ? 0.25 : 0.15;
        const taxes = gain > 0 ? Math.round(gain * taxRate) : 0;
        netProceeds = marketValue - taxes;
        
        details = `
            <div class="modal-section">
                <div class="modal-label">Sale Details</div>
                <div class="modal-row"><span>Current Value</span><span>${formatMoney(marketValue)}</span></div>
                <div class="modal-row"><span>Cost Basis</span><span>${formatMoney(asset.costBasis)}</span></div>
                <div class="modal-row"><span>${gain >= 0 ? 'Gain' : 'Loss'}</span><span style="color:${gain >= 0 ? 'var(--profit)' : 'var(--loss)'}">${formatMoney(gain)}</span></div>
                ${taxes > 0 ? `<div class="modal-row"><span>Capital Gains Tax (${Math.round(taxRate * 100)}%)</span><span style="color:var(--loss)">-${formatMoney(taxes)}</span></div>` : ''}
                <div class="modal-row" style="font-weight:600"><span>Net Proceeds</span><span style="color:var(--profit)">${formatMoney(netProceeds)}</span></div>
            </div>
            <div class="modal-tip">💡 ${asset.monthsHeld < 12 ? 'Hold 12+ months for lower capital gains tax!' : 'Long-term holding = lower taxes!'}</div>
        `;
    } else if (asset.type === 'crypto') {
        const marketValue = asset.value;
        const gain = marketValue - asset.costBasis;
        const taxRate = asset.monthsHeld < 12 ? 0.25 : 0.15;
        const taxes = gain > 0 ? Math.round(gain * taxRate) : 0;
        netProceeds = marketValue - taxes;
        
        details = `
            <div class="modal-section">
                <div class="modal-label">Sale Details</div>
                <div class="modal-row"><span>Current Value</span><span>${formatMoney(marketValue)}</span></div>
                <div class="modal-row"><span>Cost Basis</span><span>${formatMoney(asset.costBasis)}</span></div>
                <div class="modal-row"><span>${gain >= 0 ? 'Gain' : 'Loss'}</span><span style="color:${gain >= 0 ? 'var(--profit)' : 'var(--loss)'}">${formatMoney(gain)}</span></div>
                ${taxes > 0 ? `<div class="modal-row"><span>Capital Gains Tax (${Math.round(taxRate * 100)}%)</span><span style="color:var(--loss)">-${formatMoney(taxes)}</span></div>` : ''}
                <div class="modal-row" style="font-weight:600"><span>Net Proceeds</span><span style="color:var(--profit)">${formatMoney(netProceeds)}</span></div>
            </div>
            <div class="modal-tip">💡 Crypto gains are taxed; long-term holding reduces tax rates.</div>
        `;
    }
    
    showModal(`Sell ${asset.name}`, details, () => sellAsset(assetId));
}

export function sellAsset(assetId) {
    const asset = game.assets.find(a => a.id === assetId);
    if (!asset) return;
    
    const phase = economyPhases[game.economyPhase];
    let netProceeds = 0;
    
    if (asset.type === 'property') {
        const marketValue = Math.round(asset.value * phase.propertyMod);
        const fees = Math.round(marketValue * 0.06);
        const linkedDebt = game.debts.find(d => d.linkedAssetId === assetId);
        const debtPayoff = linkedDebt ? linkedDebt.balance : 0;
        netProceeds = marketValue - fees - debtPayoff;
        
        if (linkedDebt) {
            game.debts = game.debts.filter(d => d.linkedAssetId !== assetId);
        }
        
        logEvent(`🏠 Sold ${asset.name} for ${formatMoney(netProceeds)} net`, 'gold');
    } else if (asset.type === 'business') {
        const salePrice = asset.failed ? Math.round(asset.value * 0.2) : Math.round(asset.value * phase.businessMod);
        const fees = asset.failed ? 0 : Math.round(salePrice * 0.05);
        netProceeds = salePrice - fees;
        
        logEvent(`🏢 Sold ${asset.name} for ${formatMoney(netProceeds)}`, 'gold');
    } else if (asset.type === 'stock') {
        const gain = asset.value - asset.costBasis;
        const taxRate = asset.monthsHeld < 12 ? 0.25 : 0.15;
        const taxes = gain > 0 ? Math.round(gain * taxRate) : 0;
        netProceeds = asset.value - taxes;
        
        logEvent(`📈 Sold ${asset.name} for ${formatMoney(netProceeds)}`, gain >= 0 ? 'positive' : 'negative');
    } else if (asset.type === 'crypto') {
        const gain = asset.value - asset.costBasis;
        const taxRate = asset.monthsHeld < 12 ? 0.25 : 0.15;
        const taxes = gain > 0 ? Math.round(gain * taxRate) : 0;
        netProceeds = asset.value - taxes;
        
        logEvent(`🪙 Sold ${asset.name} for ${formatMoney(netProceeds)}`, gain >= 0 ? 'positive' : 'negative');
    }
    
    game.cash += netProceeds;
    game.assets = game.assets.filter(a => a.id !== assetId);
    
    closeModal();
    showToast(`Sold ${asset.name}!`);
    updateUI();
}

export function changeLifestyle(newLifestyle) {
    if (game.lifestyle === newLifestyle) return;
    
    game.lifestyle = newLifestyle;
    game.livingExpenses = Math.round(lifestyles[newLifestyle].expenses * (1 + (game.age - 18) * 0.02));
    game.salary = Math.round(game.baseSalary * lifestyles[newLifestyle].salaryMod);
    
    showToast(`Lifestyle changed to ${capitalizeFirst(newLifestyle)}`);
    logEvent(`🏠 Changed to ${capitalizeFirst(newLifestyle)} lifestyle`, 'gold');
    updateUI();
}

