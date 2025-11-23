// Admin Panel Module
const AdminManager = {
    // Initialize admin manager
    init() {
        this.setupEventListeners();
        this.setupAdminTabs();
        this.renderFoodItems();
        this.loadQRCode();
    },

    // Setup event listeners
    setupEventListeners() {
        // Add food form
        const addFoodBtn = document.getElementById('add-food-btn');
        if (addFoodBtn) {
            addFoodBtn.addEventListener('click', () => {
                this.handleAddFood();
            });
        }

        // Food image upload
        const foodImageInput = document.getElementById('food-image');
        if (foodImageInput) {
            foodImageInput.addEventListener('change', (e) => {
                this.handleImageUpload(e, 'food-image-preview');
            });
        }

        // QR code upload
        const qrFileInput = document.getElementById('qr-code-file');
        if (qrFileInput) {
            qrFileInput.addEventListener('change', (e) => {
                this.handleImageUpload(e, 'qr-code-preview');
            });
        }

        // Save QR code
        const saveQRBtn = document.getElementById('save-qr-btn');
        if (saveQRBtn) {
            saveQRBtn.addEventListener('click', () => {
                this.saveQRCode();
            });
        }

        // App icon upload
        const appIconFileInput = document.getElementById('app-icon-file');
        if (appIconFileInput) {
            appIconFileInput.addEventListener('change', (e) => {
                this.handleAppIconUpload(e);
            });
        }

        // Icon download buttons
        const downloadIcon192 = document.getElementById('download-icon-192');
        if (downloadIcon192) {
            downloadIcon192.addEventListener('click', () => {
                this.downloadIcon(192);
            });
        }

        const downloadIcon512 = document.getElementById('download-icon-512');
        if (downloadIcon512) {
            downloadIcon512.addEventListener('click', () => {
                this.downloadIcon(512);
            });
        }
    },

    // Setup admin tabs
    setupAdminTabs() {
        const tabs = document.querySelectorAll('.admin-tab');
        const tabContents = document.querySelectorAll('.admin-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;

                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));

                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetContent = document.getElementById(`admin-${targetTab}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }

                // Refresh content if needed
                if (targetTab === 'foods') {
                    this.renderFoodItems();
                } else if (targetTab === 'qr') {
                    this.loadQRCode();
                } else if (targetTab === 'logo') {
                    // App Logo tab - no additional action needed
                } else if (targetTab === 'revenue') {
                    if (typeof RevenueManager !== 'undefined') {
                        RevenueManager.init();
                    }
                }
            });
        });
    },

    // Handle add food
    handleAddFood() {
        const nameInput = document.getElementById('food-name');
        const priceInput = document.getElementById('food-price');
        const imagePreview = document.getElementById('food-image-preview');

        const name = nameInput.value.trim();
        const price = parseFloat(priceInput.value);
        const imageBase64 = imagePreview.dataset.imageBase64 || null;

        // Validation
        if (!name) {
            alert('Please enter food name');
            nameInput.focus();
            return;
        }

        if (isNaN(price) || price <= 0) {
            alert('Please enter a valid price');
            priceInput.focus();
            return;
        }

        // Add food item
        if (typeof MenuManager !== 'undefined') {
            MenuManager.addFoodItem(name, price, imageBase64);
        }

        // Clear form
        nameInput.value = '';
        priceInput.value = '';
        imagePreview.innerHTML = '';
        delete imagePreview.dataset.imageBase64;
        document.getElementById('food-image').value = '';
    },

    // Handle image upload
    handleImageUpload(event, previewId) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            event.target.value = '';
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            event.target.value = '';
            return;
        }

        // Read file as base64
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                preview.dataset.imageBase64 = e.target.result;
            }

            // Show save button for QR code
            if (previewId === 'qr-code-preview') {
                const saveBtn = document.getElementById('save-qr-btn');
                if (saveBtn) {
                    saveBtn.style.display = 'block';
                }
            }
        };
        reader.onerror = () => {
            alert('Error reading file');
        };
        reader.readAsDataURL(file);
    },

    // Render food items in admin panel
    renderFoodItems() {
        const container = document.getElementById('admin-foods-list');
        if (!container) return;

        const foodItems = MenuManager.getAllFoodItems();

        if (foodItems.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">🍽️</div><p>No food items. Add your first item above.</p></div>';
            return;
        }

        container.innerHTML = foodItems.map(item => `
            <div class="food-item-admin" data-id="${item.id}">
                <img src="${item.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'}" 
                     alt="${this.escapeHtml(item.name)}" 
                     class="food-item-admin-image"
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'">
                <div class="food-item-admin-info">
                    <div class="food-item-admin-name">${this.escapeHtml(item.name)}</div>
                    <div class="food-item-admin-price">₹${item.price.toFixed(2)}</div>
                </div>
                <div class="food-item-admin-actions">
                    <button class="btn btn-secondary btn-small edit-food-btn">Edit</button>
                    <button class="btn btn-danger btn-small delete-food-btn">Delete</button>
                </div>
            </div>
        `).join('');

        // Add event listeners
        container.querySelectorAll('.edit-food-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.target.closest('.food-item-admin');
                const id = row.dataset.id;
                this.startEditFood(id);
            });
        });

        container.querySelectorAll('.delete-food-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const row = e.target.closest('.food-item-admin');
                const id = row.dataset.id;
                if (typeof MenuManager !== 'undefined') {
                    MenuManager.deleteFoodItem(id);
                    this.renderFoodItems();
                }
            });
        });
    },

    // Start editing food item
    startEditFood(id) {
        const item = MenuManager.getFoodItem(id);
        if (!item) return;

        const row = document.querySelector(`.food-item-admin[data-id="${id}"]`);
        if (!row) return;

        row.innerHTML = `
            <div style="width: 100%;">
                <div class="form-group">
                    <label>Food Name:</label>
                    <input type="text" class="edit-food-name" value="${this.escapeHtml(item.name)}" placeholder="Enter food name">
                </div>
                <div class="form-group">
                    <label>Price (₹):</label>
                    <input type="number" class="edit-food-price" value="${item.price}" placeholder="Enter price" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label>Food Image:</label>
                    <input type="file" class="edit-food-image" accept="image/*">
                    <div class="image-preview edit-food-image-preview">
                        ${item.image ? `<img src="${item.image}" alt="Preview">` : ''}
                    </div>
                </div>
                <div class="food-item-admin-actions">
                    <button class="btn btn-secondary btn-small cancel-edit-btn">Cancel</button>
                    <button class="btn btn-primary btn-small save-edit-btn">Save</button>
                </div>
            </div>
        `;

        // Focus on name input
        row.querySelector('.edit-food-name').focus();

        // Handle image upload
        const imageInput = row.querySelector('.edit-food-image');
        imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e, 'edit-food-image-preview');
        });

        // Add event listeners
        row.querySelector('.save-edit-btn').addEventListener('click', () => {
            const name = row.querySelector('.edit-food-name').value.trim();
            const price = parseFloat(row.querySelector('.edit-food-price').value);
            const imagePreview = row.querySelector('.edit-food-image-preview');
            const imageBase64 = imagePreview.dataset.imageBase64 || item.image;

            if (!name) {
                alert('Please enter food name');
                return;
            }

            if (isNaN(price) || price <= 0) {
                alert('Please enter a valid price');
                return;
            }

            if (typeof MenuManager !== 'undefined') {
                MenuManager.updateFoodItem(id, name, price, imageBase64);
                this.renderFoodItems();
            }
        });

        row.querySelector('.cancel-edit-btn').addEventListener('click', () => {
            this.renderFoodItems();
        });
    },

    // Save QR code
    saveQRCode() {
        const preview = document.getElementById('qr-code-preview');
        if (!preview || !preview.dataset.imageBase64) return;

        const qrData = preview.dataset.imageBase64;
        Storage.saveQRCode(qrData);
        
        alert('QR Code saved successfully!');
        
        // Hide save button
        const saveBtn = document.getElementById('save-qr-btn');
        if (saveBtn) {
            saveBtn.style.display = 'none';
        }

        // Update payment screen if it exists
        if (typeof PaymentManager !== 'undefined') {
            PaymentManager.loadQRCode();
        }
    },

    // Load QR code
    loadQRCode() {
        const qrCode = Storage.getQRCode();
        const preview = document.getElementById('qr-code-preview');
        
        if (preview) {
            if (qrCode) {
                preview.innerHTML = `<img src="${qrCode}" alt="QR Code">`;
                preview.dataset.imageBase64 = qrCode;
            } else {
                preview.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📷</div><p>No QR code uploaded. Upload your UPI QR code above.</p></div>';
            }
        }
    },

    // Handle app icon upload
    handleAppIconUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            event.target.value = '';
            return;
        }

        // Read file and generate icons
        const reader = new FileReader();
        reader.onload = (e) => {
            const image = new Image();
            image.onload = () => {
                this.generateIcons(image);
            };
            image.onerror = () => {
                alert('Error loading image. Please try another image.');
            };
            image.src = e.target.result;
        };
        reader.onerror = () => {
            alert('Error reading file');
        };
        reader.readAsDataURL(file);
    },

    // Generate icons in required sizes
    generateIcons(sourceImage) {
        const sizes = [192, 512];
        const iconData = {};

        sizes.forEach(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // Draw image on canvas with proper scaling
            ctx.drawImage(sourceImage, 0, 0, size, size);

            // Store as data URL
            iconData[size] = canvas.toDataURL('image/png');
        });

        // Store icon data
        this.iconData = iconData;

        // Show preview and download section
        const preview = document.getElementById('app-icon-preview');
        if (preview) {
            preview.innerHTML = `
                <div style="display: flex; gap: 16px; align-items: center; margin-top: 12px;">
                    <div style="text-align: center;">
                        <img src="${iconData[192]}" alt="192x192 Icon" style="width: 96px; height: 96px; border: 2px solid #ddd; border-radius: 8px; padding: 4px;">
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">192x192</div>
                    </div>
                    <div style="text-align: center;">
                        <img src="${iconData[512]}" alt="512x512 Icon" style="width: 96px; height: 96px; border: 2px solid #ddd; border-radius: 8px; padding: 4px;">
                        <div style="font-size: 12px; color: #666; margin-top: 4px;">512x512</div>
                    </div>
                </div>
            `;
        }

        // Show download section
        const downloadSection = document.getElementById('icon-download-section');
        if (downloadSection) {
            downloadSection.style.display = 'block';
        }
    },

    // Download icon file
    downloadIcon(size) {
        if (!this.iconData || !this.iconData[size]) {
            alert('Please upload your logo first');
            return;
        }

        const link = document.createElement('a');
        link.download = `icon-${size}.png`;
        link.href = this.iconData[size];
        link.click();
    },

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};





