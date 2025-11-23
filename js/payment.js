// Payment Management Module
const PaymentManager = {
    // Initialize payment manager
    init() {
        this.setupEventListeners();
        this.loadQRCode();
    },

    // Setup event listeners
    setupEventListeners() {
        const backBtn = document.getElementById('back-to-billing-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (typeof App !== 'undefined') {
                    App.showScreen('billing');
                }
            });
        }

        const cancelBtn = document.getElementById('cancel-payment-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (typeof App !== 'undefined') {
                    App.showScreen('billing');
                }
            });
        }

        const markPaidBtn = document.getElementById('mark-paid-btn');
        if (markPaidBtn) {
            markPaidBtn.addEventListener('click', () => {
                this.markAsPaid();
            });
        }
    },

    // Update payment display
    updatePaymentDisplay() {
        if (typeof BillingManager === 'undefined') return;

        const billItems = BillingManager.getBillItems();
        const total = BillingManager.calculateTotal();

        // Update bill summary
        const paymentBillItems = document.getElementById('payment-bill-items');
        const paymentTotalAmount = document.getElementById('payment-total-amount');

        if (paymentBillItems) {
            paymentBillItems.innerHTML = billItems.map(item => `
                <div class="payment-bill-item">
                    <div>
                        <div class="revenue-item-name">${this.escapeHtml(item.name)}</div>
                        <div class="revenue-item-details">${item.quantity} × ₹${item.price.toFixed(2)}</div>
                    </div>
                    <div class="revenue-item-amount">₹${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `).join('');
        }

        if (paymentTotalAmount) {
            paymentTotalAmount.textContent = total.toFixed(2);
        }

        // Display QR code
        this.displayQRCode();
    },

    // Display QR code
    displayQRCode() {
        const qrDisplay = document.getElementById('qr-code-display');
        if (!qrDisplay) return;

        const qrCode = Storage.getQRCode();
        if (qrCode) {
            qrDisplay.innerHTML = `<img src="${qrCode}" alt="UPI QR Code">`;
        } else {
            qrDisplay.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📷</div><p>No QR code uploaded. Please upload QR code in Admin Panel.</p></div>';
        }
    },

    // Load QR code from storage
    loadQRCode() {
        this.displayQRCode();
    },

    // Mark as paid
    markAsPaid() {
        if (typeof BillingManager === 'undefined') return;

        const billItems = BillingManager.getBillItems();
        const total = BillingManager.calculateTotal();

        if (billItems.length === 0) {
            alert('Please add items to the bill first');
            return;
        }

        if (total <= 0) {
            alert('Bill total must be greater than zero');
            return;
        }

        // Create transaction
        const transaction = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            items: billItems,
            total: total,
            paid: true
        };

        // Save transaction
        Storage.saveTransaction(transaction);

        // Clear bill
        BillingManager.clearBill();

        // Show success message
        alert(`Bill of ₹${total.toFixed(2)} marked as paid!`);

        // Go back to home
        if (typeof App !== 'undefined') {
            App.showScreen('home');
        }

        // Update revenue if module is loaded
        if (typeof RevenueManager !== 'undefined') {
            RevenueManager.refreshReport();
        }
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};









