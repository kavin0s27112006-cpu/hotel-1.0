// Menu Management Module
const MenuManager = {
    foodItems: [],

    // Initialize menu manager
    init() {
        this.loadFoodItems();
        this.renderFoodItems();
    },

    // Load food items from storage
    loadFoodItems() {
        this.foodItems = Storage.getFoodItems();
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Get all food items
    getAllFoodItems() {
        return this.foodItems;
    },

    // Get food item by ID
    getFoodItem(id) {
        return this.foodItems.find(item => item.id === id);
    },

    // Add food item
    addFoodItem(name, price, imageBase64) {
        const newItem = {
            id: this.generateId(),
            name: name,
            price: price,
            image: imageBase64 || null
        };

        this.foodItems.push(newItem);
        Storage.saveFoodItems(this.foodItems);
        this.renderFoodItems();
        
        // Update billing screen if it exists
        if (typeof BillingManager !== 'undefined') {
            BillingManager.updateBillDisplay();
        }
    },

    // Update food item
    updateFoodItem(id, name, price, imageBase64) {
        const item = this.foodItems.find(item => item.id === id);
        if (item) {
            item.name = name;
            item.price = price;
            if (imageBase64) {
                item.image = imageBase64;
            }
            Storage.saveFoodItems(this.foodItems);
            this.renderFoodItems();
            
            // Update billing screen if it exists
            if (typeof BillingManager !== 'undefined') {
                BillingManager.updateBillDisplay();
            }
        }
    },

    // Delete food item
    deleteFoodItem(id) {
        if (confirm('Are you sure you want to delete this food item?')) {
            this.foodItems = this.foodItems.filter(item => item.id !== id);
            Storage.saveFoodItems(this.foodItems);
            this.renderFoodItems();
            
            // Update billing screen if it exists
            if (typeof BillingManager !== 'undefined') {
                BillingManager.removeItemFromBill(id);
                BillingManager.updateBillDisplay();
            }
        }
    },

    // Render food items in home screen
    renderFoodItems() {
        const container = document.getElementById('food-items-grid');
        if (!container) return;

        if (this.foodItems.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🍽️</div><p>No food items. Add items in Admin Panel.</p></div>';
            return;
        }

        container.innerHTML = this.foodItems.map(item => `
            <div class="food-item-card" data-id="${item.id}">
                <img src="${item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'}" 
                     alt="${this.escapeHtml(item.name)}" 
                     class="food-item-image"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'">
                <div class="food-item-info">
                    <div class="food-item-name">${this.escapeHtml(item.name)}</div>
                    <div class="food-item-price">₹${item.price.toFixed(2)}</div>
                </div>
            </div>
        `).join('');

        // Add click event listeners
        container.querySelectorAll('.food-item-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const itemId = card.dataset.id;
                if (typeof BillingManager !== 'undefined') {
                    BillingManager.addItemToBill(itemId);
                    // Switch to billing screen
                    if (typeof App !== 'undefined') {
                        App.showScreen('billing');
                    }
                }
            });
        });
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};









