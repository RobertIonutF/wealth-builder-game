// ===========================================
// UI RENDER FUNCTIONS
// ===========================================

import { game, currentTab } from './state.js';
import { economyPhases, lifestyles, properties, businesses, stocks, cryptocurrencies, education, jobs, jobFields, jobLevels } from './config.js';
import { formatMoney, capitalizeFirst, calculatePropertyNetIncome, getCurrentInterestRate } from './core.js';

function degreeName(id) {
    const match = education.find(e => e.degreeId === id);
    return match ? match.name : id.replace(/_/g, ' ');
}

export function renderActions() {
    const grid = document.getElementById('actionGrid');
    let items = [];
    const phase = economyPhases[game.economyPhase];
    
    if (currentTab === 'properties') {
        items = properties.map(p => {
            const locked = game.financialIQ < p.iqReq;
            const adjustedPrice = Math.round(p.price * phase.propertyMod);
            const netIncome = calculatePropertyNetIncome(p);
            return `
                <div class="action-card ${locked ? 'locked' : ''}" onclick="${locked ? '' : `showPropertyModal('${p.name}')`}">
                    ${p.tag ? `<span class="action-tag">${p.tag}</span>` : ''}
                    <div class="action-name">${p.name}</div>
                    <div class="action-stats">
                        <span>💰 ${formatMoney(adjustedPrice * 0.2)} down</span>
                        <span>📈 +${formatMoney(netIncome)}/mo</span>
                    </div>
                    <div style="font-size:0.65rem;color:var(--text-tertiary);margin-top:0.25rem">
                        Vacancy: ${Math.round(p.vacancyRate * phase.vacancyMod * 100)}%/yr
                    </div>
                    ${locked ? `<div class="action-lock">Requires IQ ${p.iqReq}</div>` : ''}
                </div>
            `;
        });
    } else if (currentTab === 'businesses') {
        items = businesses.map(b => {
            const locked = game.financialIQ < b.iqReq;
            const adjustedIncome = Math.round(b.baseIncome * phase.businessMod);
            return `
                <div class="action-card ${locked ? 'locked' : ''}" onclick="${locked ? '' : `showBusinessModal('${b.name}')`}">
                    ${b.tag ? `<span class="action-tag">${b.tag}</span>` : ''}
                    <div class="action-name">${b.name}</div>
                    <div class="action-stats">
                        <span>💰 ${formatMoney(b.price)}</span>
                        <span>📈 +${formatMoney(adjustedIncome)}/mo</span>
                    </div>
                    <div style="font-size:0.65rem;color:var(--text-tertiary);margin-top:0.25rem">
                        Risk: ${Math.round(b.failureRisk * 100)}%/yr | Growth: ${Math.round(b.growth * 100)}%
                    </div>
                    ${locked ? `<div class="action-lock">Requires IQ ${b.iqReq}</div>` : ''}
                </div>
            `;
        });
    } else if (currentTab === 'stocks') {
        items = stocks.map(s => {
            const locked = game.financialIQ < s.iqReq;
            const dividendInfo = s.dividend ? `${Math.round(s.dividend * 100)}% div` : '';
            return `
                <div class="action-card ${locked ? 'locked' : ''}" onclick="${locked ? '' : `showStockModal('${s.name}')`}">
                    ${s.tag ? `<span class="action-tag">${s.tag}</span>` : ''}
                    <div class="action-name">${s.name}</div>
                    <div class="action-stats">
                        <span>Min ${formatMoney(s.minBuy)}</span>
                        <span>${(s.returnRate * 100).toFixed(0)}% avg</span>
                    </div>
                    <div style="font-size:0.65rem;color:var(--text-tertiary);margin-top:0.25rem">
                        Vol: ${Math.round(s.volatility * 100)}% ${dividendInfo ? '| ' + dividendInfo : ''}
                    </div>
                    ${locked ? `<div class="action-lock">Requires IQ ${s.iqReq}</div>` : ''}
                </div>
            `;
        });
    } else if (currentTab === 'crypto') {
        items = cryptocurrencies.map(c => {
            const locked = game.financialIQ < c.iqReq;
            const stakingInfo = c.stakingYield ? `${Math.round(c.stakingYield * 100)}% stake` : 'No staking';
            return `
                <div class="action-card ${locked ? 'locked' : ''}" onclick="${locked ? '' : `showCryptoModal('${c.name}')`}">
                    ${c.tag ? `<span class="action-tag">${c.tag}</span>` : ''}
                    <div class="action-name">${c.name}</div>
                    <div class="action-stats">
                        <span>Min ${formatMoney(c.minBuy)}</span>
                        <span>${(c.returnRate * 100).toFixed(0)}% avg</span>
                    </div>
                    <div style="font-size:0.65rem;color:var(--text-tertiary);margin-top:0.25rem">
                        Vol: ${Math.round(c.volatility * 100)}% | ${stakingInfo}
                    </div>
                    ${locked ? `<div class="action-lock">Requires IQ ${c.iqReq}</div>` : ''}
                </div>
            `;
        });
    } else if (currentTab === 'jobs') {
        // Current job card
        if (!game.hasQuitJob) {
            const job = game.currentJob;
            const jobData = jobs[job.field][job.level];
            const levelData = jobLevels[job.level];
            const nextLevel = job.level < 7 ? jobLevels[job.level + 1] : null;
            const nextJob = nextLevel ? jobs[job.field][job.level + 1] : null;
            const monthsNeeded = nextJob ? Math.max(0, levelData.monthsToPromote - job.monthsInPosition) : 0;
            const canPromote = monthsNeeded <= 0 && nextJob;
            
            items.push(`
                <div class="action-card" style="border-color:var(--gold)">
                    <span class="action-tag">current</span>
                    <div class="action-name">${jobData.title}</div>
                    <div class="action-stats">
                        <span>💰 ${formatMoney(game.salary)}/mo</span>
                        <span>📅 ${job.monthsInPosition}mo</span>
                    </div>
                    <div style="font-size:0.65rem;color:var(--text-tertiary);margin-top:0.25rem">
                        ${job.field} • ${canPromote ? '✅ Promotion available' : nextJob ? `${monthsNeeded}mo until promotion` : 'Top level'}
                    </div>
                    <div style="margin-top:0.5rem;display:flex;gap:0.5rem">
                        <button class="btn btn-secondary" style="flex:1;padding:0.5rem;font-size:0.8rem" onclick="showCurrentJobModal()">View Details</button>
                        ${canPromote ? `<button class="btn btn-primary" style="flex:1;padding:0.5rem;font-size:0.8rem" onclick="showPromotionModal()">Request Promotion</button>` : ''}
                    </div>
                </div>
            `);
        } else {
            items.push(`
                <div class="action-card" style="border-color:var(--loss)">
                    <span class="action-tag">unemployed</span>
                    <div class="action-name">No Current Job</div>
                    <div class="action-stats"><span>Apply for jobs below</span></div>
                </div>
            `);
        }
        
        // Quit job option
        if (!game.hasQuitJob) {
            items.push(`
                <div class="action-card" onclick="showQuitJobModal()">
                    <div class="action-name">🚪 Quit Current Job</div>
                    <div class="action-stats"><span>Focus on businesses</span></div>
                </div>
            `);
        }
        
        // Available jobs by field
        jobFields.forEach(field => {
            const fieldJobs = jobs[field];
            fieldJobs.forEach((job, level) => {
                const canApply = checkJobRequirements(job);
                const isCurrentJob = !game.hasQuitJob && game.currentJob.field === field && game.currentJob.level === level;
                
                if (isCurrentJob) return; // Skip current job
                
                let requirements = [];
                if (job.requiredDegrees && job.requiredDegrees.length > 0) {
                    job.requiredDegrees.forEach(d => {
                        const has = game.education.completedDegrees?.includes(d);
                        const name = degreeName(d);
                        if (!has) requirements.push(name);
                    });
                } else {
                    if (job.educationReq === 'bachelors' && !game.education.hasBachelors) {
                        requirements.push('Bachelor\'s');
                    } else if (job.educationReq === 'masters' && !game.education.hasMasters) {
                        requirements.push('Master\'s');
                    }
                }
                if (game.financialIQ < job.iqReq) {
                    requirements.push(`IQ ${job.iqReq}`);
                }
                
                items.push(`
                    <div class="action-card ${canApply ? '' : 'locked'}" onclick="${canApply ? `showJobApplicationModal('${field}', ${level})` : ''}">
                        <div class="action-name">${job.title}</div>
                        <div class="action-stats">
                            <span>💰 ${formatMoney(job.baseSalary)}/mo</span>
                            <span>${field}</span>
                        </div>
                        ${requirements.length > 0 ? `<div class="action-lock">Need: ${requirements.join(', ')}</div>` : ''}
                    </div>
                `);
            });
        });
    } else if (currentTab === 'education') {
        // Current enrollment status
        if (game.education.educationInProgress) {
            const edu = education.find(e => e.name === game.education.educationInProgress);
            const monthsRemaining = game.education.monthsRemaining;
            const yearsRemaining = Math.floor(monthsRemaining / 12);
            const monthsLeft = monthsRemaining % 12;
            
            items.push(`
                <div class="action-card" style="border-color:var(--gold)">
                    <span class="action-tag">enrolled</span>
                    <div class="action-name">${edu.name}</div>
                    <div class="action-stats">
                        <span>⏱️ ${yearsRemaining > 0 ? yearsRemaining + 'y ' : ''}${monthsLeft}m remaining</span>
                        <span>🧠 +${edu.iqGain} IQ</span>
                    </div>
                    <button class="btn btn-secondary" style="margin-top:0.5rem;width:100%;padding:0.5rem;font-size:0.8rem" onclick="quitEducation()">Quit Program</button>
                </div>
            `);
        }
        
        // Education options
        education.forEach(e => {
            const isEnrolled = game.education.educationInProgress === e.name;
            const hasDegree = game.education.completedDegrees?.includes(e.degreeId);
            const prereqs = e.prerequisites || [];
            const missingPrereqs = prereqs.filter(p => !game.education.completedDegrees?.includes(p));
            const needsAnyBachelors = e.requiresAnyBachelors && !game.education.hasBachelors;
            const canEnroll = missingPrereqs.length === 0 && !needsAnyBachelors;
            const canStart = canEnroll && !game.education.educationInProgress && !hasDegree;
            
            if (isEnrolled || hasDegree) return; // Skip if enrolled or completed
            
            items.push(`
                <div class="action-card ${canStart ? '' : 'locked'}" ${canStart ? `onclick="showEducationModal(this.dataset.edu)" data-edu=${JSON.stringify(e.name)}` : ''}>
                    ${e.tag ? `<span class="action-tag">${e.tag}</span>` : ''}
                    <div class="action-name">${e.name}</div>
                    <div class="action-stats">
                        <span>💰 ${formatMoney(e.price)}</span>
                        <span>🧠 +${e.iqGain} IQ</span>
                    </div>
                    ${!e.instant ? `<div style="font-size:0.65rem;color:var(--text-tertiary);margin-top:0.25rem">Duration: ${Math.floor(e.monthsRequired / 12)}y ${e.monthsRequired % 12}m</div>` : ''}
                    ${prereqs.length ? `<div style="font-size:0.65rem;color:var(--text-tertiary);margin-top:0.25rem">Prereq: ${prereqs.map(degreeName).join(', ')}</div>` : ''}
                    ${needsAnyBachelors ? `<div class="action-lock">Requires any Bachelor's</div>` : ''}
                    ${missingPrereqs.length > 0 ? `<div class="action-lock">Need: ${missingPrereqs.map(degreeName).join(', ')}</div>` : ''}
                    ${!canStart && !missingPrereqs.length && !needsAnyBachelors ? `<div class="action-lock">Already enrolled</div>` : ''}
                </div>
            `);
        });
    } else if (currentTab === 'debt') {
        items = [
            `<div class="action-card" onclick="showPayDebtModal()">
                <div class="action-name">💳 Pay Off Debt</div>
                <div class="action-stats"><span>Make extra payments</span></div>
            </div>`,
            `<div class="action-card ${game.creditScore < 700 ? 'locked' : ''}" onclick="${game.creditScore >= 700 ? 'showRefinanceModal()' : ''}">
                <div class="action-name">🔄 Refinance</div>
                <div class="action-stats"><span>Lower interest rates</span></div>
                ${game.creditScore < 700 ? '<div class="action-lock">Need 700+ credit</div>' : ''}
            </div>`,
            `<div class="action-card ${game.creditScore < 650 ? 'locked' : ''}" onclick="${game.creditScore >= 650 ? 'showBankLoanModal()' : ''}">
                <div class="action-name">🏦 Get Bank Loan</div>
                <div class="action-stats"><span>Current rate: ${(getCurrentInterestRate() * 100).toFixed(1)}%</span></div>
                ${game.creditScore < 650 ? '<div class="action-lock">Need 650+ credit</div>' : ''}
            </div>`
        ];
    } else if (currentTab === 'lifestyle') {
        const lifestyleItems = Object.entries(lifestyles).map(([key, val]) => {
            const isActive = game.lifestyle === key;
            return `
                <div class="action-card ${isActive ? 'active' : ''}" onclick="changeLifestyle('${key}')" style="${isActive ? 'border-color:var(--gold);background:var(--bg-hover)' : ''}">
                    ${isActive ? '<span class="action-tag">current</span>' : ''}
                    <div class="action-name">${capitalizeFirst(key)}</div>
                    <div class="action-stats">
                        <span>💰 ${formatMoney(val.expenses)}/mo</span>
                    </div>
                    <div style="font-size:0.65rem;color:var(--text-tertiary);margin-top:0.25rem">
                        ${val.description}
                    </div>
                </div>
            `;
        });
        
        const canQuit = game.escapedRatRace && !game.hasQuitJob;
        const quitCard = game.hasQuitJob ? 
            `<div class="action-card" style="border-color:var(--profit)">
                <span class="action-tag">active</span>
                <div class="action-name">🏠 Self-Employed</div>
                <div class="action-stats"><span>+10% business income</span></div>
            </div>` :
            `<div class="action-card ${canQuit ? '' : 'locked'}" onclick="${canQuit ? 'showQuitJobModal()' : ''}">
                <div class="action-name">🚪 Quit Job</div>
                <div class="action-stats"><span>Focus on your businesses</span></div>
                ${!canQuit ? '<div class="action-lock">Escape rat race first</div>' : ''}
            </div>`;
        
        items = [...lifestyleItems, quitCard];
    }
    
    grid.innerHTML = items.join('');
}

function checkJobRequirements(job) {
    if (job.requiredDegrees && job.requiredDegrees.length > 0) {
        const hasNeeded = job.requiredDegrees.some(d => game.education.completedDegrees?.includes(d));
        if (!hasNeeded) return false;
    } else {
        if (job.educationReq === 'bachelors' && !game.education.hasBachelors) return false;
        if (job.educationReq === 'masters' && !game.education.hasMasters) return false;
    }
    if (game.financialIQ < job.iqReq) return false;
    return true;
}

