// Local Storage Wrapper with IndexedDB support
const Storage = {
    // Keys
    KEYS: {
        FOOD_ITEMS: 'hotel_food_items',
        TRANSACTIONS: 'hotel_transactions',
        QR_CODE: 'hotel_qr_code'
    },

    // Save data to localStorage
    save(key, data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            return true;
        } catch (error) {
            console.error('Error saving to storage:', error);
            // If localStorage is full, try to clear old data
            if (error.name === 'QuotaExceededError') {
                alert('Storage is full. Please clear some old data.');
            }
            return false;
        }
    },

    // Load data from localStorage
    load(key, defaultValue = null) {
        try {
            const jsonData = localStorage.getItem(key);
            if (jsonData === null) {
                return defaultValue;
            }
            return JSON.parse(jsonData);
        } catch (error) {
            console.error('Error loading from storage:', error);
            return defaultValue;
        }
    },

    // Remove data from localStorage
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    },

    // Clear all app data
    clear() {
        try {
            Object.values(this.KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    },

    // Food Items Operations
    getFoodItems() {
        return this.load(this.KEYS.FOOD_ITEMS, []);
    },

    saveFoodItems(items) {
        return this.save(this.KEYS.FOOD_ITEMS, items);
    },

    // Transactions Operations
    getTransactions() {
        return this.load(this.KEYS.TRANSACTIONS, []);
    },

    saveTransaction(transaction) {
        const transactions = this.getTransactions();
        transactions.push(transaction);
        return this.save(this.KEYS.TRANSACTIONS, transactions);
    },

    saveTransactions(transactions) {
        return this.save(this.KEYS.TRANSACTIONS, transactions);
    },

    // QR Code Operations
    getQRCode() {
        return this.load(this.KEYS.QR_CODE, null);
    },

    saveQRCode(qrCodeBase64) {
        return this.save(this.KEYS.QR_CODE, qrCodeBase64);
    }
};









