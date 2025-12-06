// ===========================================
// UTILITY FUNCTIONS
// ===========================================

import { game } from './state.js';

export function logEvent(text, type = 'neutral') {
    const log = document.getElementById('eventLog');
    const div = document.createElement('div');
    div.className = `event-item ${type}`;
    div.textContent = `M${game.month}: ${text}`;
    log.insertBefore(div, log.firstChild);
    if (log.children.length > 20) log.removeChild(log.lastChild);
}

export function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

export function showModal(title, content, onConfirm) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = content;
    document.getElementById('modalConfirm').onclick = onConfirm;
    document.getElementById('modal').classList.add('active');
}

export function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

