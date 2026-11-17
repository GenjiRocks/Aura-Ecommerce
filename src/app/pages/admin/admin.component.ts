import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { Product, Order } from '../../models/ecommerce.models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-slate-50 min-h-screen py-8 md:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Dashboard Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-white uppercase tracking-wider">
                Store Console
              </span>
              <span class="text-xs text-slate-500">Live Management</span>
            </div>
            <h1 class="text-3xl font-extrabold text-slate-900 font-heading mt-1">
              Admin Dashboard
            </h1>
            <p class="text-xs text-slate-500 mt-1">
              Manage inventory, live catalog, customer orders, and dispatch workflows.
            </p>
          </div>

          <div class="flex items-center gap-3">
            <button
              (click)="resetCatalog()"
              class="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-all shadow-xs"
            >
              Reset to Original Data
            </button>
            <a
              routerLink="/shop"
              class="px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
            >
              View Live Storefront &rarr;
            </a>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <!-- Total Revenue -->
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Volume</p>
              <h3 class="text-2xl font-extrabold text-slate-900 font-heading mt-1">\${{ totalRevenue() }}</h3>
              <p class="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <span>&uarr; 18.4%</span>
                <span class="text-slate-400 font-normal">vs last month</span>
              </p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>

          <!-- Total Orders -->
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Orders Handled</p>
              <h3 class="text-2xl font-extrabold text-slate-900 font-heading mt-1">{{ orderService.orders().length }}</h3>
              <p class="text-xs text-sky-600 font-semibold mt-1">All active & delivered</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
          </div>

          <!-- Products in Catalog -->
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Catalog</p>
              <h3 class="text-2xl font-extrabold text-slate-900 font-heading mt-1">{{ productService.products().length }}</h3>
              <p class="text-xs text-brand-600 font-semibold mt-1">Across 4 categories</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
          </div>

          <!-- Conversion Rate -->
          <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversion Rate</p>
              <h3 class="text-2xl font-extrabold text-slate-900 font-heading mt-1">3.92%</h3>
              <p class="text-xs text-emerald-600 font-semibold mt-1">+0.4% this week</p>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Section Navigation Tabs -->
        <div class="flex items-center gap-2 border-b border-slate-200 mb-6">
          <button
            (click)="activeTab.set('products')"
            class="px-5 py-3 text-xs font-bold rounded-t-2xl transition-all"
            [ngClass]="activeTab() === 'products' ? 'bg-white text-slate-900 border-t border-x border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
          >
            Product Catalog ({{ productService.products().length }})
          </button>
          <button
            (click)="activeTab.set('orders')"
            class="px-5 py-3 text-xs font-bold rounded-t-2xl transition-all"
            [ngClass]="activeTab() === 'orders' ? 'bg-white text-slate-900 border-t border-x border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
          >
            Order Management ({{ orderService.orders().length }})
          </button>
        </div>

        <!-- TAB 1: PRODUCT MANAGEMENT -->
        @if (activeTab() === 'products') {
          <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
            
            <!-- Filter Bar & Add Button -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex flex-wrap items-center gap-3 flex-1">
                <!-- Search Input -->
                <div class="relative w-full sm:w-64">
                  <input
                    type="text"
                    [(ngModel)]="productSearch"
                    placeholder="Search catalog..."
                    class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>

                <!-- Category selector -->
                <select
                  [(ngModel)]="productCategoryFilter"
                  class="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Home & Workspace">Home & Workspace</option>
                  <option value="Accessories & Gear">Accessories & Gear</option>
                </select>
              </div>

              <!-- Add New Product Button -->
              <button
                (click)="openAddProductModal()"
                class="px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-95"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Add New Product</span>
              </button>
            </div>

            <!-- Products Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th class="py-3 px-3">Item</th>
                    <th class="py-3 px-3">Category</th>
                    <th class="py-3 px-3">Price</th>
                    <th class="py-3 px-3">Stock Status</th>
                    <th class="py-3 px-3">Rating</th>
                    <th class="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  @for (prod of filteredAdminProducts(); track prod.id) {
                    <tr class="hover:bg-slate-50/80 transition-colors">
                      <td class="py-3 px-3">
                        <div class="flex items-center gap-3">
                          <img [src]="prod.image" [alt]="prod.name" class="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0" />
                          <div class="min-w-0 max-w-xs">
                            <p class="font-bold text-slate-900 truncate">{{ prod.name }}</p>
                            <span class="text-[10px] text-slate-400 font-mono">{{ prod.id }}</span>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-3 font-medium">{{ prod.category }}</td>
                      <td class="py-3 px-3 font-bold text-slate-900 font-heading">\${{ prod.price }}</td>
                      <td class="py-3 px-3">
                        <span
                          class="px-2.5 py-1 text-[11px] font-semibold rounded-full"
                          [ngClass]="prod.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
                        >
                          {{ prod.inStock ? ('In Stock (' + prod.stockQuantity + ')') : 'Out of Stock' }}
                        </span>
                      </td>
                      <td class="py-3 px-3 font-semibold text-slate-800">
                        {{ prod.rating }} ★ ({{ prod.reviewsCount }})
                      </td>
                      <td class="py-3 px-3 text-right space-x-2">
                        <button
                          (click)="openEditProductModal(prod)"
                          class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          (click)="confirmDeleteProduct(prod)"
                          class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-lg transition-colors text-[11px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- TAB 2: ORDER MANAGEMENT -->
        @if (activeTab() === 'orders') {
          <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 class="text-base font-bold text-slate-900 font-heading">
                All Customer Orders ({{ orderService.orders().length }})
              </h3>
              <p class="text-xs text-slate-500">
                You can change order fulfillment statuses below to simulate live logistics!
              </p>
            </div>

            <!-- Orders Table -->
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th class="py-3 px-3">Order ID</th>
                    <th class="py-3 px-3">Customer</th>
                    <th class="py-3 px-3">Date</th>
                    <th class="py-3 px-3">Total Amount</th>
                    <th class="py-3 px-3">Payment</th>
                    <th class="py-3 px-3">Fulfillment Status</th>
                    <th class="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  @for (order of orderService.orders(); track order.id) {
                    <tr class="hover:bg-slate-50/80 transition-colors">
                      <td class="py-3 px-3">
                        <span class="font-bold text-slate-900 font-mono">{{ order.id }}</span>
                        <span class="block text-[10px] text-brand-600 font-mono">{{ order.trackingNumber }}</span>
                      </td>
                      <td class="py-3 px-3">
                        <p class="font-semibold text-slate-900">{{ order.customer.name }}</p>
                        <p class="text-[10px] text-slate-400">{{ order.customer.email }}</p>
                      </td>
                      <td class="py-3 px-3 text-slate-500">
                        {{ order.createdAt | date:'shortDate' }}
                      </td>
                      <td class="py-3 px-3 font-bold text-slate-900 font-heading">\${{ order.total }}</td>
                      <td class="py-3 px-3">
                        <span class="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700">
                          {{ order.paymentStatus }}
                        </span>
                        <span class="block text-[10px] text-slate-400 truncate max-w-[130px]">{{ order.paymentMethod }}</span>
                      </td>
                      <td class="py-3 px-3">
                        <!-- Live Status Dropdown -->
                        <select
                          [ngModel]="order.status"
                          (ngModelChange)="onOrderStatusChange(order.id, $event)"
                          class="px-2.5 py-1 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td class="py-3 px-3 text-right">
                        <a
                          [routerLink]="['/track']"
                          [queryParams]="{ tracking: order.trackingNumber }"
                          class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg transition-colors text-[11px]"
                        >
                          View Track
                        </a>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Add / Edit Product Modal with Mandatory Backdrop Blur -->
    @if (showProductModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in"
        (click)="showProductModal.set(false)"
      >
        <div
          class="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border border-slate-100 animate-scale-in space-y-4 max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-lg font-bold text-slate-900 font-heading">
              {{ editingProductId ? 'Edit Product' : 'Add New Product to Catalog' }}
            </h3>
            <button (click)="showProductModal.set(false)" class="text-slate-400 hover:text-slate-700">&times;</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Product Title</label>
              <input
                type="text"
                [(ngModel)]="productForm.name"
                placeholder="e.g. Aura Pro Carbon Keyboard"
                class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select [(ngModel)]="productForm.category" class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl">
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Home & Workspace">Home & Workspace</option>
                  <option value="Accessories & Gear">Accessories & Gear</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  [(ngModel)]="productForm.badge"
                  placeholder="e.g. Bestseller, New"
                  class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Price (\$)</label>
                <input
                  type="number"
                  [(ngModel)]="productForm.price"
                  class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Original Price (\$)</label>
                <input
                  type="number"
                  [(ngModel)]="productForm.originalPrice"
                  class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Stock Qty</label>
                <input
                  type="number"
                  [(ngModel)]="productForm.stockQuantity"
                  class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
              <input
                type="text"
                [(ngModel)]="productForm.image"
                placeholder="https://images.unsplash.com/..."
                class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                [(ngModel)]="productForm.description"
                rows="3"
                placeholder="Brief product description..."
                class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl"
              ></textarea>
            </div>
          </div>

          <div class="pt-4 flex gap-3 border-t border-slate-100">
            <button
              (click)="showProductModal.set(false)"
              class="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              (click)="saveProduct()"
              class="flex-1 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl"
            >
              {{ editingProductId ? 'Save Changes' : 'Create Product' }}
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Delete Confirmation Modal with Mandatory Backdrop Blur -->
    @if (deletingProduct(); as prod) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in"
        (click)="deletingProduct.set(null)"
      >
        <div
          class="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-scale-in text-center space-y-4"
          (click)="$event.stopPropagation()"
        >
          <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 font-heading">Delete Product?</h3>
            <p class="text-xs text-slate-500 mt-1">
              Are you sure you want to remove <strong>{{ prod.name }}</strong> from the catalog? This action is instant.
            </p>
          </div>
          <div class="flex gap-3 pt-2">
            <button
              (click)="deletingProduct.set(null)"
              class="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              (click)="executeDelete()"
              class="flex-1 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminComponent {
  productService = inject(ProductService);
  orderService = inject(OrderService);
  toastService = inject(ToastService);

  activeTab = signal<'products' | 'orders'>('products');

  productSearch = '';
  productCategoryFilter = '';

  showProductModal = signal(false);
  editingProductId: string | null = null;
  deletingProduct = signal<Product | null>(null);

  productForm = {
    name: '',
    category: 'Electronics',
    price: 199,
    originalPrice: 249,
    stockQuantity: 25,
    badge: 'New Arrival',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop',
    description: 'Precision engineered modern lifestyle product.'
  };

  totalRevenue = computed(() => {
    return this.orderService.orders().reduce((acc, o) => acc + o.total, 0).toFixed(2);
  });

  filteredAdminProducts = computed(() => {
    let list = this.productService.products();
    if (this.productCategoryFilter) {
      list = list.filter(p => p.category === this.productCategoryFilter);
    }
    if (this.productSearch.trim()) {
      const q = this.productSearch.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    return list;
  });

  openAddProductModal(): void {
    this.editingProductId = null;
    this.productForm = {
      name: '',
      category: 'Electronics',
      price: 199,
      originalPrice: 249,
      stockQuantity: 25,
      badge: 'New Arrival',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop',
      description: 'Precision engineered modern lifestyle product.'
    };
    this.showProductModal.set(true);
  }

  openEditProductModal(prod: Product): void {
    this.editingProductId = prod.id;
    this.productForm = {
      name: prod.name,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stockQuantity: prod.stockQuantity,
      badge: prod.badge || '',
      image: prod.image,
      description: prod.description
    };
    this.showProductModal.set(true);
  }

  saveProduct(): void {
    if (!this.productForm.name.trim()) {
      this.toastService.show('Validation Error', 'Please enter a product title', 'error');
      return;
    }

    if (this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, {
        name: this.productForm.name,
        category: this.productForm.category,
        price: this.productForm.price,
        originalPrice: this.productForm.originalPrice,
        stockQuantity: this.productForm.stockQuantity,
        inStock: this.productForm.stockQuantity > 0,
        badge: this.productForm.badge || undefined,
        image: this.productForm.image,
        description: this.productForm.description
      });
      this.toastService.show('Product Updated', `${this.productForm.name} updated successfully.`, 'success');
    } else {
      this.productService.addProduct({
        name: this.productForm.name,
        slug: '',
        category: this.productForm.category,
        price: this.productForm.price,
        originalPrice: this.productForm.originalPrice,
        stockQuantity: this.productForm.stockQuantity,
        inStock: this.productForm.stockQuantity > 0,
        badge: this.productForm.badge || undefined,
        image: this.productForm.image,
        images: [this.productForm.image],
        description: this.productForm.description,
        rating: 5.0,
        reviewsCount: 1,
        features: ['Precision craftsmanship', '1-year warranty', 'Eco-friendly materials']
      });
      this.toastService.show('Product Created', `${this.productForm.name} added to catalog!`, 'success');
    }

    this.showProductModal.set(false);
  }

  confirmDeleteProduct(prod: Product): void {
    this.deletingProduct.set(prod);
  }

  executeDelete(): void {
    const prod = this.deletingProduct();
    if (prod) {
      this.productService.deleteProduct(prod.id);
      this.toastService.show('Product Deleted', `${prod.name} removed from catalog.`, 'info');
      this.deletingProduct.set(null);
    }
  }

  onOrderStatusChange(orderId: string, newStatus: any): void {
    this.orderService.updateOrderStatus(orderId, newStatus);
  }

  resetCatalog(): void {
    this.productService.resetToDefaults();
    this.toastService.show('Reset Complete', 'Catalog restored to default datasets.', 'info');
  }
}
