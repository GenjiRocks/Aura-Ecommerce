import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-slate-50 min-h-screen py-10 md:py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- User Profile Header Card -->
        <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <img
              [src]="authService.user()?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop'"
              alt="Avatar"
              class="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
            />
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-xl md:text-2xl font-bold text-slate-900 font-heading">
                  {{ authService.user()?.name }}
                </h1>
                <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-900 text-white font-mono">
                  {{ authService.user()?.tier }}
                </span>
              </div>
              <p class="text-xs text-slate-500 mt-0.5">
                {{ authService.user()?.email }} &bull; Member since {{ authService.user()?.memberSince }}
              </p>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-3 w-full md:w-auto">
            <button
              (click)="authService.toggleRole()"
              class="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-semibold rounded-xl transition-colors border border-brand-200"
            >
              Current: {{ authService.isAdmin() ? 'Administrator' : 'Customer' }} (Click to switch)
            </button>
            <a
              routerLink="/admin"
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Admin Dashboard
            </a>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
          <button
            (click)="activeTab.set('orders')"
            class="px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all"
            [ngClass]="activeTab() === 'orders' ? 'bg-white text-slate-900 border-t border-x border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
          >
            My Orders ({{ orderService.orders().length }})
          </button>
          <button
            (click)="activeTab.set('addresses')"
            class="px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all"
            [ngClass]="activeTab() === 'addresses' ? 'bg-white text-slate-900 border-t border-x border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
          >
            Saved Addresses
          </button>
          <button
            (click)="activeTab.set('payments')"
            class="px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all"
            [ngClass]="activeTab() === 'payments' ? 'bg-white text-slate-900 border-t border-x border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-800'"
          >
            Payment Methods
          </button>
        </div>

        <!-- TAB 1: Orders -->
        @if (activeTab() === 'orders') {
          <div class="space-y-4">
            @for (order of orderService.orders(); track order.id) {
              <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div class="flex items-center gap-3">
                      <span class="text-sm font-bold text-slate-900 font-mono">{{ order.id }}</span>
                      <span
                        class="px-2.5 py-0.5 text-xs font-semibold rounded-full"
                        [ngClass]="{
                          'bg-emerald-50 text-emerald-700': order.status === 'Delivered',
                          'bg-sky-50 text-sky-700': order.status === 'In Transit' || order.status === 'Processing',
                          'bg-amber-50 text-amber-700': order.status === 'Pending' || order.status === 'Dispatched'
                        }"
                      >
                        {{ order.status }}
                      </span>
                    </div>
                    <p class="text-xs text-slate-500 mt-1">
                      Placed on {{ order.createdAt | date:'medium' }} &bull; Total: <strong class="text-slate-900 font-heading">\${{ order.total }}</strong>
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <a
                      [routerLink]="['/track']"
                      [queryParams]="{ tracking: order.trackingNumber }"
                      class="px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                      </svg>
                      <span>Track Shipment</span>
                    </a>
                  </div>
                </div>

                <!-- Items in this order -->
                <div class="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  @for (item of order.items; track item.id) {
                    <div class="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <img [src]="item.image" [alt]="item.name" class="w-12 h-12 rounded-lg object-cover bg-white" />
                      <div class="min-w-0 flex-1">
                        <p class="text-xs font-semibold text-slate-800 truncate">{{ item.name }}</p>
                        <p class="text-[10px] text-slate-500">Qty: {{ item.quantity }} &bull; \${{ item.price }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }

        <!-- TAB 2: Addresses -->
        @if (activeTab() === 'addresses') {
          <div class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-base font-bold text-slate-900 font-heading">Saved Delivery Locations</h3>
              <button
                (click)="showAddressModal.set(true)"
                class="px-4 py-2 bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Add New Address</span>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (addr of authService.user()?.savedAddresses; track addr.id) {
                <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span class="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-800">
                        {{ addr.tag }}
                      </span>
                      @if (addr.isDefault) {
                        <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Default Address
                        </span>
                      }
                    </div>
                    <p class="text-sm font-bold text-slate-900 mt-2">{{ addr.fullName }}</p>
                    <p class="text-xs text-slate-600 mt-1">{{ addr.street }}</p>
                    <p class="text-xs text-slate-600">{{ addr.city }}, {{ addr.state }} - {{ addr.zip }}</p>
                    <p class="text-xs text-slate-500 mt-2 font-mono">{{ addr.phone }}</p>
                  </div>

                  <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    @if (!addr.isDefault) {
                      <button
                        (click)="authService.setDefaultAddress(addr.id)"
                        class="text-xs text-brand-600 font-semibold hover:underline"
                      >
                        Set as Default
                      </button>
                    } @else {
                      <span></span>
                    }
                    <button
                      (click)="authService.deleteAddress(addr.id)"
                      class="text-xs text-rose-600 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- TAB 3: Payments -->
        @if (activeTab() === 'payments') {
          <div class="space-y-6">
            <h3 class="text-base font-bold text-slate-900 font-heading">Linked Payment Instruments</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (pm of authService.user()?.savedPaymentMethods; track pm.id) {
                <div class="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
                  <div class="flex items-center gap-3.5">
                    <div class="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {{ pm.type === 'card' ? pm.brand : 'UPI' }}
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-slate-900 font-heading">
                        {{ pm.type === 'card' ? ('•••• ' + pm.last4) : pm.upiId }}
                      </h4>
                      <p class="text-xs text-slate-500">
                        {{ pm.type === 'card' ? ('Expires ' + pm.expiry) : pm.brand }}
                      </p>
                    </div>
                  </div>

                  @if (pm.isDefault) {
                    <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Primary
                    </span>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Add Address Modal with Mandatory Backdrop Blur -->
    @if (showAddressModal()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md animate-fade-in"
        (click)="showAddressModal.set(false)"
      >
        <div
          class="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-100 animate-scale-in space-y-4"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="text-base font-bold text-slate-900 font-heading">Add New Address</h3>
            <button (click)="showAddressModal.set(false)" class="text-slate-400 hover:text-slate-700">&times;</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Label Tag (e.g. Home, Office)</label>
              <input type="text" [(ngModel)]="newAddress.tag" placeholder="Home" class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input type="text" [(ngModel)]="newAddress.fullName" placeholder="Full Name" class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input type="text" [(ngModel)]="newAddress.phone" placeholder="+91 ..." class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
              <input type="text" [(ngModel)]="newAddress.street" placeholder="Address line" class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <input type="text" [(ngModel)]="newAddress.city" placeholder="City" class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl" />
              <input type="text" [(ngModel)]="newAddress.state" placeholder="State" class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <input type="text" [(ngModel)]="newAddress.zip" placeholder="ZIP" class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl" />
              <input type="text" [(ngModel)]="newAddress.country" placeholder="Country" class="w-full px-3 py-2 text-xs bg-slate-50 border rounded-xl" />
            </div>
          </div>

          <div class="pt-4 flex gap-3">
            <button (click)="showAddressModal.set(false)" class="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl">Cancel</button>
            <button (click)="saveAddress()" class="flex-1 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl">Save Address</button>
          </div>
        </div>
      </div>
    }
  `
})
export class AccountComponent {
  authService = inject(AuthService);
  orderService = inject(OrderService);
  toastService = inject(ToastService);

  activeTab = signal<'orders' | 'addresses' | 'payments'>('orders');
  showAddressModal = signal(false);

  newAddress = {
    tag: 'Home',
    fullName: 'Ashwin',
    phone: '+91 98765 43210',
    street: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560038',
    country: 'India',
    isDefault: false
  };

  saveAddress(): void {
    if (!this.newAddress.street) {
      this.toastService.show('Error', 'Please enter a street address', 'error');
      return;
    }
    this.authService.addAddress(this.newAddress);
    this.showAddressModal.set(false);
  }
}
