// ============================================
//  MOBILE DRAWER FUNCTIONALITY
// ============================================

function toggleMobileDrawer(type) {
    const drawers = {
        'finances': 'drawerFinances',
        'assets': 'drawerAssets',
        'events': 'drawerEvents'
    };

    const drawerId = drawers[type];
    if (!drawerId) return;

    const drawer = document.getElementById(drawerId);
    if (!drawer) return;

    // Close all other drawers first
    Object.values(drawers).forEach(id => {
        if (id !== drawerId) {
            document.getElementById(id)?.classList.remove('active');
        }
    });

    // Toggle the selected drawer
    const isActive = drawer.classList.toggle('active');

    // If opening, sync content
    if (isActive) {
        syncMobileDrawerContent(type);
    }

    // Prevent body scroll when drawer is open
    if (isActive) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileDrawers() {
    const drawers = ['drawerFinances', 'drawerAssets', 'drawerEvents'];
    
    drawers.forEach(drawerId => {
        document.getElementById(drawerId)?.classList.remove('active');
    });

    // Re-enable body scroll
    document.body.style.overflow = '';
}

function syncMobileDrawerContent(type) {
    if (type === 'finances') {
        syncFinancesDrawer();
    } else if (type === 'assets') {
        syncAssetsDrawer();
    } else if (type === 'events') {
        syncEventsDrawer();
    }
}

function syncFinancesDrawer() {
    const mobileContainer = document.getElementById('mobileFinances');
    const desktopSidebar = document.querySelector('.sidebar-left');
    
    if (!mobileContainer || !desktopSidebar) return;

    // Clone the financial statement content
    const financialPanel = desktopSidebar.querySelector('.panel');
    const debtPanel = desktopSidebar.querySelectorAll('.panel')[1];

    if (financialPanel) {
        const financialClone = financialPanel.cloneNode(true);
        mobileContainer.innerHTML = '';
        mobileContainer.appendChild(financialClone);

        // Add debt panel if exists
        if (debtPanel) {
            const debtClone = debtPanel.cloneNode(true);
            debtClone.style.marginTop = '1rem';
            mobileContainer.appendChild(debtClone);
        }
    }
}

function syncAssetsDrawer() {
    const mobileContainer = document.getElementById('mobileAssets');
    const desktopSidebar = document.querySelector('.sidebar-right');
    
    if (!mobileContainer || !desktopSidebar) return;

    // Clone the assets panel
    const assetsPanel = desktopSidebar.querySelector('.panel');

    if (assetsPanel) {
        const assetsClone = assetsPanel.cloneNode(true);
        mobileContainer.innerHTML = '';
        mobileContainer.appendChild(assetsClone);
    }
}

function syncEventsDrawer() {
    const mobileContainer = document.getElementById('mobileEvents');
    const desktopSidebar = document.querySelector('.sidebar-right');
    
    if (!mobileContainer || !desktopSidebar) return;

    // Clone events and stats panels
    const panels = desktopSidebar.querySelectorAll('.panel');
    
    mobileContainer.innerHTML = '';
    
    panels.forEach((panel, index) => {
        const clone = panel.cloneNode(true);
        if (index > 0) {
            clone.style.marginTop = '1rem';
        }
        mobileContainer.appendChild(clone);
    });
}

// Close drawer when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileDrawers();
    }
});

// Prevent scroll on body when drawer is open
document.addEventListener('touchmove', (e) => {
    const drawers = ['drawerFinances', 'drawerAssets', 'drawerEvents'];
    const isDrawerOpen = drawers.some(id => 
        document.getElementById(id)?.classList.contains('active')
    );

    if (isDrawerOpen && !e.target.closest('.mobile-drawer-content')) {
        e.preventDefault();
    }
}, { passive: false });

// Auto-sync drawer content periodically when open (every 2 seconds)
setInterval(() => {
    const drawers = {
        'drawerFinances': 'finances',
        'drawerAssets': 'assets',
        'drawerEvents': 'events'
    };

    Object.entries(drawers).forEach(([drawerId, type]) => {
        const drawer = document.getElementById(drawerId);
        if (drawer?.classList.contains('active')) {
            syncMobileDrawerContent(type);
        }
    });
}, 2000);
