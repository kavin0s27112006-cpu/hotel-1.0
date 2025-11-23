// Main Application Logic
const App = {
    currentScreen: 'home',

    // Initialize the application
    init() {
        this.setupNavigation();
        this.registerServiceWorker();
        this.initializeModules();
        this.showScreen('home');
    },

    // Setup navigation
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.dataset.screen;
                this.showScreen(screen);
            });
        });
    },

    // Show screen
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show selected screen
        const targetScreen = document.getElementById(screenName);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }

        // Update navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.screen === screenName) {
                btn.classList.add('active');
            }
        });

        this.currentScreen = screenName;

        // Refresh content based on screen
        this.refreshScreen(screenName);
    },

    // Refresh screen content
    refreshScreen(screenName) {
        switch (screenName) {
            case 'home':
                if (typeof MenuManager !== 'undefined') {
                    MenuManager.renderFoodItems();
                }
                break;
            case 'billing':
                if (typeof BillingManager !== 'undefined') {
                    BillingManager.updateBillDisplay();
                }
                break;
            case 'payment':
                if (typeof PaymentManager !== 'undefined') {
                    PaymentManager.updatePaymentDisplay();
                }
                break;
            case 'admin':
                if (typeof AdminManager !== 'undefined') {
                    AdminManager.renderFoodItems();
                    AdminManager.loadQRCode();
                }
                break;
        }
    },

    // Register service worker for offline functionality
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registered:', registration);
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed:', error);
                    });
            });
        }
    },

    // Initialize all modules
    initializeModules() {
        // Initialize Menu Manager
        if (typeof MenuManager !== 'undefined') {
            MenuManager.init();
        }

        // Initialize Billing Manager
        if (typeof BillingManager !== 'undefined') {
            BillingManager.init();
        }

        // Initialize Payment Manager
        if (typeof PaymentManager !== 'undefined') {
            PaymentManager.init();
        }

        // Initialize Revenue Manager
        if (typeof RevenueManager !== 'undefined') {
            RevenueManager.init();
        }

        // Initialize Admin Manager
        if (typeof AdminManager !== 'undefined') {
            AdminManager.init();
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
    });
} else {
    App.init();
}

// Prevent default form submission
document.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Handle back button on mobile (prevent navigation away from app)
window.addEventListener('popstate', (e) => {
    history.pushState(null, null, window.location.href);
});

// Push initial state
history.pushState(null, null, window.location.href);









