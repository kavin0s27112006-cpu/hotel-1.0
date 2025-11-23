// Revenue Management Module
const RevenueManager = {
    currentFilter: 'daily',

    // Initialize revenue manager
    init() {
        this.setupEventListeners();
        this.loadDailyReport();
    },

    // Setup event listeners
    setupEventListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });

        const generateBtn = document.getElementById('generate-custom-report-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateCustomReport();
            });
        }
    },

    // Set filter
    setFilter(filter) {
        this.currentFilter = filter;

        // Update active button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        // Show/hide custom date range
        const customRange = document.getElementById('custom-date-range');
        if (customRange) {
            customRange.style.display = filter === 'custom' ? 'block' : 'none';
        }

        // Load appropriate report
        switch (filter) {
            case 'daily':
                this.loadDailyReport();
                break;
            case 'monthly':
                this.loadMonthlyReport();
                break;
            case 'custom':
                // Wait for user to generate report
                break;
        }
    },

    // Load daily report
    loadDailyReport() {
        const transactions = Storage.getTransactions();
        const revenueByDay = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.timestamp);
            const dateKey = this.formatDate(date);

            if (!revenueByDay[dateKey]) {
                revenueByDay[dateKey] = {
                    date: date,
                    total: 0,
                    items: {}
                };
            }

            revenueByDay[dateKey].total += transaction.total;

            // Track item-wise breakdown
            transaction.items.forEach(item => {
                if (!revenueByDay[dateKey].items[item.itemId]) {
                    revenueByDay[dateKey].items[item.itemId] = {
                        name: item.name,
                        quantity: 0,
                        revenue: 0
                    };
                }
                revenueByDay[dateKey].items[item.itemId].quantity += item.quantity;
                revenueByDay[dateKey].items[item.itemId].revenue += (item.price * item.quantity);
            });
        });

        this.renderReport(Object.values(revenueByDay).sort((a, b) => b.date - a.date));
    },

    // Load monthly report
    loadMonthlyReport() {
        const transactions = Storage.getTransactions();
        const revenueByMonth = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.timestamp);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!revenueByMonth[monthKey]) {
                revenueByMonth[monthKey] = {
                    date: new Date(date.getFullYear(), date.getMonth(), 1),
                    total: 0,
                    items: {}
                };
            }

            revenueByMonth[monthKey].total += transaction.total;

            // Track item-wise breakdown
            transaction.items.forEach(item => {
                if (!revenueByMonth[monthKey].items[item.itemId]) {
                    revenueByMonth[monthKey].items[item.itemId] = {
                        name: item.name,
                        quantity: 0,
                        revenue: 0
                    };
                }
                revenueByMonth[monthKey].items[item.itemId].quantity += item.quantity;
                revenueByMonth[monthKey].items[item.itemId].revenue += (item.price * item.quantity);
            });
        });

        this.renderReport(Object.values(revenueByMonth).sort((a, b) => b.date - a.date));
    },

    // Generate custom report
    generateCustomReport() {
        const fromDateInput = document.getElementById('revenue-from-date');
        const toDateInput = document.getElementById('revenue-to-date');

        if (!fromDateInput || !toDateInput) return;

        const fromDate = new Date(fromDateInput.value);
        const toDate = new Date(toDateInput.value);

        if (!fromDateInput.value || !toDateInput.value) {
            alert('Please select both from and to dates');
            return;
        }

        if (fromDate > toDate) {
            alert('From date must be before or equal to to date');
            return;
        }

        const transactions = Storage.getTransactions();
        const revenueByDay = {};

        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.timestamp);
            const transDateOnly = new Date(transactionDate.getFullYear(), 
                                         transactionDate.getMonth(), 
                                         transactionDate.getDate());
            const fromDateOnly = new Date(fromDate.getFullYear(), 
                                        fromDate.getMonth(), 
                                        fromDate.getDate());
            const toDateOnly = new Date(toDate.getFullYear(), 
                                      toDate.getMonth(), 
                                      toDate.getDate());

            if (transDateOnly >= fromDateOnly && transDateOnly <= toDateOnly) {
                const dateKey = this.formatDate(transactionDate);

                if (!revenueByDay[dateKey]) {
                    revenueByDay[dateKey] = {
                        date: transactionDate,
                        total: 0,
                        items: {}
                    };
                }

                revenueByDay[dateKey].total += transaction.total;

                transaction.items.forEach(item => {
                    if (!revenueByDay[dateKey].items[item.itemId]) {
                        revenueByDay[dateKey].items[item.itemId] = {
                            name: item.name,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    revenueByDay[dateKey].items[item.itemId].quantity += item.quantity;
                    revenueByDay[dateKey].items[item.itemId].revenue += (item.price * item.quantity);
                });
            }
        });

        this.renderReport(Object.values(revenueByDay).sort((a, b) => b.date - a.date));
    },

    // Render report
    renderReport(revenueData) {
        const container = document.getElementById('revenue-report');
        if (!container) return;

        if (revenueData.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📊</div><p>No revenue data found.</p></div>';
            return;
        }

        container.innerHTML = revenueData.map(day => {
            const dateStr = this.currentFilter === 'monthly' 
                ? this.formatMonth(day.date)
                : this.formatDateForDisplay(day.date);
            
            const itemsHtml = Object.values(day.items).map(item => `
                <div class="revenue-item">
                    <div class="revenue-item-info">
                        <div class="revenue-item-name">${this.escapeHtml(item.name)}</div>
                        <div class="revenue-item-details">Quantity: ${item.quantity}</div>
                    </div>
                    <div class="revenue-item-amount">₹${item.revenue.toFixed(2)}</div>
                </div>
            `).join('');

            return `
                <div class="revenue-day">
                    <div class="revenue-day-header">
                        <div class="revenue-day-date">${dateStr}</div>
                        <div class="revenue-day-total">₹${day.total.toFixed(2)}</div>
                    </div>
                    <div class="revenue-items">
                        ${itemsHtml}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Format date
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    // Format date for display
    formatDateForDisplay(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return date.toLocaleDateString('en-US', options);
    },

    // Format month for display
    formatMonth(date) {
        const options = { 
            year: 'numeric', 
            month: 'long'
        };
        return date.toLocaleDateString('en-US', options);
    },

    // Refresh report
    refreshReport() {
        if (this.currentFilter === 'daily') {
            this.loadDailyReport();
        } else if (this.currentFilter === 'monthly') {
            this.loadMonthlyReport();
        }
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};









