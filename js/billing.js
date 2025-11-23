// Billing Management Module
const BillingManager = {
    currentBill: {}, // { itemId: quantity }

    // Initialize billing manager
    init() {
        this.setupEventListeners();
        this.updateBillDisplay();
    },

    // Setup event listeners
    setupEventListeners() {
        const proceedBtn = document.getElementById('proceed-to-payment-btn');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                const billItems = this.getBillItems();
                if (billItems.length === 0) {
                    alert('Please add items to the bill first');
                    return;
                }
                if (typeof App !== 'undefined') {
                    App.showScreen('payment');
                    if (typeof PaymentManager !== 'undefined') {
                        PaymentManager.updatePaymentDisplay();
                    }
                }
            });
        }

        const backBtn = document.getElementById('back-to-home-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (typeof App !== 'undefined') {
                    App.showScreen('home');
                }
            });
        }
    },

    // Add item to bill
    addItemToBill(itemId) {
        const currentQuantity = this.currentBill[itemId] || 0;
        this.currentBill[itemId] = currentQuantity + 1;
        this.updateBillDisplay();
    },

    // Remove item from bill
    removeItemFromBill(itemId) {
        delete this.currentBill[itemId];
        this.updateBillDisplay();
    },

    // Update item quantity
    updateItemQuantity(itemId, quantity) {
        if (quantity <= 0) {
            delete this.currentBill[itemId];
        } else {
            this.currentBill[itemId] = quantity;
        }
        this.updateBillDisplay();
    },

    // Update bill display
    updateBillDisplay() {
        const container = document.getElementById('bill-items-list');
        const billSummary = document.getElementById('bill-summary');
        const billTotalAmount = document.getElementById('bill-total-amount');

        if (!container) return;

        const billItems = this.getBillItems();
        const total = this.calculateTotal();

        if (billItems.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">💰</div><p>No items in bill. Select items from home screen.</p></div>';
            if (billSummary) {
                billSummary.style.display = 'none';
            }
            return;
        }

        if (billSummary) {
            billSummary.style.display = 'block';
        }

        if (billTotalAmount) {
            billTotalAmount.textContent = total.toFixed(2);
        }

        // Render bill items
        container.innerHTML = billItems.map(item => `
            <div class="bill-item" data-id="${item.itemId}">
                <img src="${item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'}" 
                     alt="${this.escapeHtml(item.name)}" 
                     class="bill-item-image"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'">
                <div class="bill-item-details">
                    <div class="bill-item-name">${this.escapeHtml(item.name)}</div>
                    <div class="bill-item-price">₹${item.price.toFixed(2)} each</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-btn" data-id="${item.itemId}">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn increase-btn" data-id="${item.itemId}">+</button>
                    </div>
                </div>
                <div class="bill-item-total">₹${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        // Add event listeners for quantity controls
        container.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                const currentQuantity = this.currentBill[itemId] || 0;
                this.updateItemQuantity(itemId, currentQuantity - 1);
            });
        });

        container.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                const currentQuantity = this.currentBill[itemId] || 0;
                this.updateItemQuantity(itemId, currentQuantity + 1);
            });
        });
    },

    // Get bill items with details
    getBillItems() {
        const foodItems = MenuManager.getAllFoodItems();
        const billItems = [];

        Object.keys(this.currentBill).forEach(itemId => {
            const quantity = this.currentBill[itemId];
            if (quantity > 0) {
                const foodItem = foodItems.find(item => item.id === itemId);
                if (foodItem) {
                    billItems.push({
                        itemId: foodItem.id,
                        name: foodItem.name,
                        price: foodItem.price,
                        quantity: quantity,
                        image: foodItem.image
                    });
                }
            }
        });

        return billItems;
    },

    // Calculate total
    calculateTotal() {
        const billItems = this.getBillItems();
        return billItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    },

    // Clear bill
    clearBill() {
        this.currentBill = {};
        this.updateBillDisplay();
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};









