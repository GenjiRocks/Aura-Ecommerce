# AURA • Modern Lifestyle & Tech E-Commerce Website

An interactive, responsive e-commerce application built with modern Angular 19, Tailwind CSS, and reactive Signals.

---

## 🌟 Features Implemented

### 1. Product Listing, Filters & Live Search
- **Live Autocomplete Search**: Global search bar in navbar with real-time popup dropdown showing product thumbnail, price, and category.
- **Deep Filter Sidebar**:
  - Category selector (Electronics, Fashion & Apparel, Home & Workspace, Accessories & Gear)
  - Interactive price range slider (\$40 – \$800)
  - Star rating filter (4.5★+, 4.8★+ top tier)
  - In-stock availability toggle
  - Active filter chips with individual dismiss and "Clear All"
  - Sorting: Featured, Price: Low to High, Price: High to Low, Rating, Newest
- **Product Card**:
  - Image hover zoom transition
  - Quick View modal trigger with backdrop blur
  - Instant wishlist heart toggle with badge animation
  - 1-click add to cart action

### 2. Cart, Wishlist & Multi-Step Checkout
- **Slide-Over Shopping Bag Drawer**:
  - Background backdrop blur (`modal-backdrop-blur`)
  - Item counter steppers (+ / - / remove)
  - Free shipping progress bar (Unlocks free delivery over \$100)
  - Promo code validation engine (Try `WELCOME20` for 20% OFF or `AURA10` for 10% OFF)
  - Financial breakdown: Subtotal, Discount, Shipping, Tax, Total
- **Wishlist Manager**:
  - Live navbar heart counter badge
  - Dedicated `/wishlist` view to view saved items, remove, or "Move All to Bag"
- **Checkout Workflow**:
  - Step 1: Customer & Shipping Address (Saved addresses quick-pick or manual input)
  - Step 2: Delivery method selection (Standard Free vs Priority Express)
  - Step 3: Interactive Payment Gateway

### 3. Interactive Payment Gateway Integration
- **Credit / Debit Card Simulation**:
  - Interactive live 3D card preview updating as the customer types Card Number, Cardholder Name, Expiry, and CVV
  - Card brand auto-detection (Visa, Mastercard, Amex)
- **UPI / QR Gateway**:
  - Simulated high-res QR code with instant scan support (GPay, PhonePe, Paytm, CRED)
  - Virtual Payment Address (VPA) input
- **Net Banking**:
  - Selection for major banks (HDFC, ICICI, SBI, Axis, Kotak)
- **Cash on Delivery (COD)**
- **Gateway Handshake Simulation**:
  - When the user clicks "Authorize & Pay", a secure modal with backdrop blur opens
  - Real-time animated progress bar with steps:
    1. *Establishing 256-bit encrypted channel*
    2. *Authenticating with payment provider & 3D Secure*
    3. *Processing authorization tokens*
    4. *Payment Authorized!*
  - Automatically transitions to the **Order Confirmed** screen with newly generated Order ID, BlueDart tracking number, and live tracking button.

### 4. Order Tracking & User Accounts
- **Live Logistics Tracking (`/track`)**:
  - Lookup by Order ID (`ORD-94821`) or Tracking Number (`BD-88239041IN`)
  - Visual tracking step timeline with animated active step dot:
    `Order Placed` &rarr; `Processing & Packaging` &rarr; `Dispatched` &rarr; `In Transit` &rarr; `Out for Delivery` &rarr; `Delivered`
  - Delivery courier details, recipient address, package items list, and invoice download simulation
- **User Account Dashboard (`/account`)**:
  - Customer profile overview with tier badge (`Aura Black VIP`)
  - Order history tab with direct tracking links
  - Saved addresses manager: add new address modal (with backdrop blur), set default address, remove address
  - Linked payment methods view

### 5. Admin Dashboard (`/admin`)
- **Key Metrics Overview**:
  - Total Gross Sales Volume (\$148,920+)
  - Total Orders Handled
  - Active Products in Catalog
  - Conversion Rate & Trends
- **Product Inventory Management**:
  - Search & filter catalog table
  - Add New Product modal (with image URL, price, category, stock count, description)
  - Edit Product modal
  - Delete Product confirmation modal with backdrop blur
  - "Reset to Factory Catalog" to reload default mock data
- **Order Management Console**:
  - Order table with customer info, payment status, and totals
  - Interactive Fulfillment Status dropdown (`Pending`, `Processing`, `Dispatched`, `In Transit`, `Out for Delivery`, `Delivered`, `Cancelled`)
  - Updating an order's status in the admin console immediately updates its timeline events across the customer tracking page!

---

## 📁 Dummy Data & Images in Public Folder

All mock data is located inside the `public/data/` directory for convenient inspection and editing:

- **`public/data/products.json`**:
  Contains 16 realistic, high-quality products across 4 categories with descriptions, features, pricing, discount badges, and Unsplash photography URLs.
- **`public/data/categories.json`**:
  Category definitions, hero images, and descriptions.
- **`public/data/orders.json`**:
  Initial sample customer orders with complete logistics timelines and item breakdowns.
- **`public/data/user.json`**:
  User profile for Ashwin, saved shipping addresses, and saved payment methods.

Changes made via the Admin Dashboard or during checkout persist automatically to the browser's `localStorage` while retaining the default fallback in `public/data/`.

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server on port 4300
npx ng serve --port 4300 --disable-host-check

# Build production bundle with SSR / static prerender
npm run build
```
