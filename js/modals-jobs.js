// ===========================================
// MODAL FUNCTIONS - Jobs
// ===========================================

import { game } from './state.js';
import { jobs, jobFields, jobLevels, lifestyles, economyPhases, education } from './config.js';
import { formatMoney, capitalizeFirst, getPassiveIncome } from './core.js';
import { showModal, closeModal, showToast, logEvent } from './utils.js';
import { updateUI } from './ui.js';

function degreeName(id) {
    const match = education.find(e => e.degreeId === id);
    return match ? match.name : id.replace(/_/g, ' ');
}

export function showCurrentJobModal() {
    if (game.hasQuitJob) {
        showModal('Current Status', `
            <div class="modal-section">
                <div class="modal-label">Employment Status</div>
                <div class="modal-row"><span>Status</span><span style="color:var(--loss)">Unemployed</span></div>
                <div class="modal-tip">💡 You've quit your job. Apply for a new position to get back to work!</div>
            </div>
        `);
        return;
    }

    const job = game.currentJob;
    const jobData = jobs[job.field][job.level];
    const levelData = jobLevels[job.level];
    const nextLevel = job.level < 7 ? jobLevels[job.level + 1] : null;
    const nextJob = nextLevel ? jobs[job.field][job.level + 1] : null;
    const monthsNeeded = levelData.monthsToPromote - job.monthsInPosition;
    const canPromote = monthsNeeded <= 0 && nextJob && checkJobRequirements(nextJob);

    showModal('Current Job', `
        <div class="modal-section">
            <div class="modal-label">Job Details</div>
            <div class="modal-row"><span>Field</span><span>${job.field}</span></div>
            <div class="modal-row"><span>Title</span><span>${jobData.title}</span></div>
            <div class="modal-row"><span>Base Salary</span><span style="color:var(--profit)">${formatMoney(jobData.baseSalary)}/mo</span></div>
            <div class="modal-row"><span>Current Salary</span><span style="color:var(--profit)">${formatMoney(game.salary)}/mo</span></div>
            <div class="modal-row"><span>Time in Position</span><span>${job.monthsInPosition} months</span></div>
        </div>
        ${nextJob ? `
        <div class="modal-section">
            <div class="modal-label">Next Level: ${nextJob.title}</div>
            <div class="modal-row"><span>Salary</span><span style="color:var(--profit)">${formatMoney(nextJob.baseSalary)}/mo</span></div>
            <div class="modal-row"><span>Months Needed</span><span>${Math.max(0, monthsNeeded)}</span></div>
            ${canPromote ? '<div class="modal-tip" style="color:var(--profit)">✅ Eligible for promotion!</div>' : '<div class="modal-tip">⏳ Not yet eligible for promotion</div>'}
        </div>
        ` : '<div class="modal-tip">🏆 You\'ve reached the top level!</div>'}
    `);
}

export function showJobApplicationModal(field, level) {
    const job = jobs[field][level];
    const canApply = checkJobRequirements(job);
    const successChance = calculateApplicationSuccess(job, field, level);

    let requirements = [];
    if (job.requiredDegrees && job.requiredDegrees.length > 0) {
        job.requiredDegrees.forEach(d => {
            const has = game.education.completedDegrees?.includes(d);
            requirements.push(`${has ? '✅' : '❌'} ${degreeName(d)}`);
        });
    } else {
        if (job.educationReq === 'bachelors' && !game.education.hasBachelors) {
            requirements.push('❌ Bachelor\'s Degree required');
        } else if (job.educationReq === 'bachelors') {
            requirements.push('✅ Bachelor\'s Degree');
        }
        if (job.educationReq === 'masters' && !game.education.hasMasters) {
            requirements.push('❌ Master\'s Degree required');
        } else if (job.educationReq === 'masters') {
            requirements.push('✅ Master\'s Degree');
        }
    }
    if (game.financialIQ < job.iqReq) {
        requirements.push(`❌ Financial IQ ${job.iqReq} required (you have ${game.financialIQ})`);
    } else {
        requirements.push(`✅ Financial IQ ${job.iqReq}`);
    }

    showModal(`Apply for ${job.title}`, `
        <div class="modal-section">
            <div class="modal-label">Job Details</div>
            <div class="modal-row"><span>Field</span><span>${field}</span></div>
            <div class="modal-row"><span>Title</span><span>${job.title}</span></div>
            <div class="modal-row"><span>Base Salary</span><span style="color:var(--profit)">${formatMoney(job.baseSalary)}/mo</span></div>
        </div>
        <div class="modal-section">
            <div class="modal-label">Requirements</div>
            ${requirements.map(r => `<div class="modal-row"><span></span><span>${r}</span></div>`).join('')}
        </div>
        <div class="modal-section">
            <div class="modal-label">Application</div>
            <div class="modal-row"><span>Success Chance</span><span style="color:${successChance >= 70 ? 'var(--profit)' : successChance >= 40 ? 'var(--text-secondary)' : 'var(--loss)'}">${Math.round(successChance)}%</span></div>
        </div>
        ${canApply ? '' : '<div class="modal-tip" style="color:var(--loss)">⚠️ You don\'t meet all requirements</div>'}
    `, canApply ? () => applyForJob(field, level) : null);
}

export function applyForJob(field, level) {
    const job = jobs[field][level];
    const successChance = calculateApplicationSuccess(job, field, level);
    
    if (Math.random() * 100 < successChance) {
        // Success
        if (!game.hasQuitJob) {
            game.jobHistory.push({
                ...game.currentJob,
                endMonth: game.month
            });
        }
        
        game.currentJob = {
            field: field,
            level: level,
            title: job.title,
            baseSalary: job.baseSalary,
            monthsInPosition: 0
        };
        game.baseSalary = job.baseSalary;
        game.salary = Math.round(job.baseSalary * lifestyles[game.lifestyle].salaryMod);
        game.hasQuitJob = false;
        
        closeModal();
        showToast(`🎉 Got the job! ${job.title}`);
        logEvent(`💼 Started new job: ${job.title} at ${formatMoney(game.salary)}/mo`, 'positive');
        updateUI();
    } else {
        // Failed
        closeModal();
        showToast('😔 Application rejected');
        logEvent(`❌ Application for ${job.title} was rejected`, 'negative');
    }
}

export function showPromotionModal() {
    const job = game.currentJob;
    if (game.hasQuitJob || job.level >= 7) {
        showToast('No promotion available');
        return;
    }

    const nextLevel = job.level + 1;
    const nextJob = jobs[job.field][nextLevel];
    const levelData = jobLevels[job.level];
    const monthsNeeded = levelData.monthsToPromote - job.monthsInPosition;

    if (monthsNeeded > 0) {
        showToast(`Need ${monthsNeeded} more months in current position`);
        return;
    }

    if (!checkJobRequirements(nextJob)) {
        showToast('You don\'t meet the requirements for promotion');
        return;
    }

    const successChance = calculateApplicationSuccess(nextJob, job.field, nextLevel, true);

    showModal(`Request Promotion to ${nextJob.title}`, `
        <div class="modal-section">
            <div class="modal-label">Promotion Details</div>
            <div class="modal-row"><span>Current</span><span>${jobs[job.field][job.level].title}</span></div>
            <div class="modal-row"><span>New Title</span><span>${nextJob.title}</span></div>
            <div class="modal-row"><span>Current Salary</span><span>${formatMoney(game.salary)}/mo</span></div>
            <div class="modal-row"><span>New Salary</span><span style="color:var(--profit)">${formatMoney(nextJob.baseSalary * lifestyles[game.lifestyle].salaryMod)}/mo</span></div>
            <div class="modal-row"><span>Success Chance</span><span style="color:var(--profit)">${Math.round(successChance)}%</span></div>
        </div>
        <div class="modal-tip">💡 Promotions within the same field have higher success rates!</div>
    `, () => requestPromotion());
}

export function requestPromotion() {
    const job = game.currentJob;
    const nextLevel = job.level + 1;
    const nextJob = jobs[job.field][nextLevel];
    const successChance = calculateApplicationSuccess(nextJob, job.field, nextLevel, true);

    if (Math.random() * 100 < successChance) {
        // Success
        game.currentJob.level = nextLevel;
        game.currentJob.title = nextJob.title;
        game.currentJob.baseSalary = nextJob.baseSalary;
        game.currentJob.monthsInPosition = 0;
        game.baseSalary = nextJob.baseSalary;
        game.salary = Math.round(nextJob.baseSalary * lifestyles[game.lifestyle].salaryMod);

        closeModal();
        showToast(`🎉 Promoted to ${nextJob.title}!`);
        logEvent(`📈 Promoted to ${nextJob.title} at ${formatMoney(game.salary)}/mo`, 'gold');
        updateUI();
    } else {
        closeModal();
        showToast('😔 Promotion request denied');
        logEvent(`❌ Promotion request to ${nextJob.title} was denied`, 'negative');
    }
}

export function showQuitJobModal() {
    if (game.hasQuitJob) {
        showToast('You already quit your job');
        return;
    }

    const businessIncome = game.assets.filter(a => a.type === 'business' && !a.failed)
        .reduce((sum, a) => sum + a.income, 0);
    const bonusIncome = Math.round(businessIncome * 0.1);

    showModal('Quit Your Job?', `
        <div class="modal-section">
            <div class="modal-label">Current Situation</div>
            <div class="modal-row"><span>Job</span><span>${game.currentJob.title}</span></div>
            <div class="modal-row"><span>Salary</span><span>${formatMoney(game.salary)}/mo</span></div>
            <div class="modal-row"><span>Passive Income</span><span style="color:var(--profit)">${formatMoney(getPassiveIncome())}/mo</span></div>
        </div>
        <div class="modal-section">
            <div class="modal-label">After Quitting</div>
            <div class="modal-row"><span>Salary</span><span style="color:var(--loss)">$0/mo</span></div>
            <div class="modal-row"><span>Business Bonus (+10%)</span><span style="color:var(--profit)">+${formatMoney(bonusIncome)}/mo</span></div>
        </div>
        <div class="modal-tip">💡 <strong>Rich Dad Tip:</strong> Focus full-time on your businesses for +10% income. You can always apply for a new job later!</div>
    `, quitJob);
}

export function quitJob() {
    game.jobHistory.push({
        ...game.currentJob,
        endMonth: game.month
    });
    game.hasQuitJob = true;
    game.salary = 0;
    
    closeModal();
    showToast('🎉 You quit your job! Full-time entrepreneur!');
    logEvent('🚀 Quit job to focus on businesses!', 'gold');
    updateUI();
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

function calculateApplicationSuccess(job, field, level, isPromotion = false) {
    let chance = 60; // Base chance
    
    // Education requirement met
    if (checkJobRequirements(job)) {
        chance += 20;
    }
    
    // IQ bonus
    const iqBonus = Math.min(30, Math.floor((game.financialIQ - job.iqReq) / 10) * 10);
    chance += iqBonus;
    
    // Economy penalty
    if (game.economyPhase === 'recession') {
        chance -= 20;
    }
    
    // Promotion bonus (same field)
    if (isPromotion && !game.hasQuitJob && game.currentJob.field === field) {
        chance += 15;
    }
    
    return Math.max(10, Math.min(95, chance));
}

