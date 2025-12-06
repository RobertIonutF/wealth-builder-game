// ===========================================
// WEALTH BUILDER - MAIN ENTRY POINT
// ===========================================

import { game, setCurrentTab } from './state.js';
import { initializeEconomy, capitalizeFirst } from './core.js';
import { logEvent, closeModal } from './utils.js';
import { updateUI, renderActions } from './ui.js';
import { showPropertyModal, showBusinessModal, showStockModal, updateStockPreview, showCryptoModal, updateCryptoPreview, buyCrypto } from './modals.js';
import { showEducationModal, showSellAssetModal, changeLifestyle, sellAsset, quitEducation } from './modals-extra.js';
import { showPayDebtModal, showRefinanceModal, showBankLoanModal, updateLoanPayment } from './modals-debt.js';
import { showCurrentJobModal, showJobApplicationModal, showPromotionModal, showQuitJobModal, quitJob } from './modals-jobs.js';
import { advanceMonth, skipYear } from './gameloop.js';

// Start game function
export function startGame() {
    document.getElementById('introScreen').classList.add('hidden');
    initializeEconomy();
    updateUI();
    logEvent('🚀 Started your wealth-building journey!', 'gold');
    logEvent(`📊 Economy: ${capitalizeFirst(game.economyPhase)} phase`, 'gold');
}

// Attach all interactive functions to window for onclick handlers
window.startGame = startGame;
window.advanceMonth = advanceMonth;
window.skipYear = skipYear;
window.showPropertyModal = showPropertyModal;
window.showBusinessModal = showBusinessModal;
window.showStockModal = showStockModal;
window.updateStockPreview = updateStockPreview;
window.showCryptoModal = showCryptoModal;
window.updateCryptoPreview = updateCryptoPreview;
window.buyCrypto = buyCrypto;
window.showEducationModal = showEducationModal;
window.showSellAssetModal = showSellAssetModal;
window.changeLifestyle = changeLifestyle;
window.showCurrentJobModal = showCurrentJobModal;
window.showJobApplicationModal = showJobApplicationModal;
window.showPromotionModal = showPromotionModal;
window.showQuitJobModal = showQuitJobModal;
window.quitJob = quitJob;
window.quitEducation = quitEducation;
window.showPayDebtModal = showPayDebtModal;
window.showRefinanceModal = showRefinanceModal;
window.showBankLoanModal = showBankLoanModal;
window.updateLoanPayment = updateLoanPayment;
window.closeModal = closeModal;

// ===========================================
// INITIALIZATION
// ===========================================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('actionTabs').addEventListener('click', (e) => {
        if (e.target.classList.contains('tab')) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            setCurrentTab(e.target.dataset.tab);
            renderActions();
        }
    });
    
    updateUI();
});
