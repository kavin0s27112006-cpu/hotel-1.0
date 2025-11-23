# Hotel Billing System - Mobile PWA App

A Progressive Web App (PWA) for hotel billing that works offline and can be installed on mobile devices like a native app.

## 🚀 Quick Start

### Run Locally

**Python:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx http-server -p 8000
```

Then open: `http://localhost:8000`

## 📱 Install on Mobile Phone

### Step 1: Access on Your Phone

1. Make sure your phone and computer are on the same Wi-Fi network
2. Find your computer's IP address:
   - **Windows:** `ipconfig` (look for IPv4 Address)
   - **Mac/Linux:** `ifconfig` or `ip addr`
3. On your phone's browser, go to: `http://YOUR_IP:8000`

### Step 2: Install as App

**Android (Chrome):**
- Tap menu (⋮) → "Add to Home Screen" or "Install App"
- Tap "Install"

**iPhone (Safari):**
- Tap Share button → "Add to Home Screen"
- Tap "Add"

**Result:** App icon appears on home screen and opens in full-screen mode!

## ✨ Features

- ✅ **Home Screen** - Food items grid with images
- ✅ **Billing** - Select items, set quantities, view bill
- ✅ **Payment** - Display UPI QR code for payment
- ✅ **Admin Panel** - Manage foods, QR code, and view revenue
- ✅ **Offline Support** - Works without internet
- ✅ **Mobile Responsive** - Touch-optimized UI
- ✅ **Local Storage** - All data stored on device

## 📋 Features Breakdown

### Home Screen
- Grid view of food items with images
- Click item to add to bill
- Navigate to billing screen

### Billing Screen
- View selected items with quantities
- Adjust quantities (+/-)
- View total amount
- Proceed to payment

### Payment Screen
- Bill summary
- UPI QR code display
- Mark as paid (saves transaction)

### Admin Panel

**Foods Tab:**
- Add food items (name, price, image)
- Edit food items
- Delete food items

**QR Code Tab:**
- Upload UPI QR code image
- Change QR code anytime

**Revenue Tab:**
- Daily reports
- Monthly reports
- Custom date range reports
- Item-wise breakdown

## 🎨 Create App Icons

1. Open `create-icons.html` in your browser
2. Click "Generate Icons"
3. Download both icon files
4. Place `icon-192.png` and `icon-512.png` in the root folder

## 📂 File Structure

```
hotel/
├── index.html              # Main app
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── app.js             # Main app logic
│   ├── storage.js         # Local storage
│   ├── menu.js            # Menu management
│   ├── billing.js         # Billing system
│   ├── payment.js         # Payment screen
│   ├── revenue.js         # Revenue reports
│   └── admin.js           # Admin panel
└── MOBILE_INSTALL.md      # Installation guide
```

## 🔧 Technical Details

- **Technology:** HTML, CSS, JavaScript (Vanilla JS)
- **Storage:** LocalStorage (no database needed)
- **Offline:** Service Worker for caching
- **PWA:** Full Progressive Web App support
- **Mobile:** Touch-optimized, responsive design

## 📱 Browser Support

- ✅ Chrome (Android & Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Edge (Windows & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Samsung Internet

## 💾 Data Storage

All data is stored locally in your browser:
- Food items
- Transactions
- QR code image
- Revenue data

**Note:** Data is stored on your device only. Clear browser data = lose all data.

## 🚀 Deploy Online (Optional)

For permanent access, deploy to:
- **GitHub Pages** (Free)
- **Netlify** (Free)
- **Vercel** (Free)
- **Firebase Hosting** (Free)

## 📖 Usage Guide

1. **First Time Setup:**
   - Open app → Go to Admin Panel
   - Add food items with images
   - Upload your UPI QR code

2. **Creating a Bill:**
   - Home screen → Click food items
   - Billing screen → Adjust quantities
   - Payment screen → Show QR code → Mark as paid

3. **View Revenue:**
   - Admin Panel → Revenue tab
   - Select Daily/Monthly/Custom
   - View reports with item-wise breakdown

## 🐛 Troubleshooting

**App not installing?**
- Make sure you're using HTTP/HTTPS (not file://)
- Check browser console for errors
- Try a different browser

**Icons not showing?**
- Create icons using `create-icons.html`
- Place icon files in root folder

**Offline not working?**
- Make sure service worker is registered
- Visit app once while online
- Check browser console

## 📝 License

Free to use for personal and commercial purposes.

---

**Enjoy your Hotel Billing App!** 🎉









