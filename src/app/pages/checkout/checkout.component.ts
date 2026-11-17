import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { Order } from '../../models/ecommerce.models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-slate-50 min-h-screen py-10 md:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Breadcrumb / Steps Header -->
        <div class="max-w-4xl mx-auto mb-10">
          <div class="flex items-center justify-between text-xs font-semibold text-slate-500 mb-4">
            <span [ngClass]="currentStep() >= 1 ? 'text-brand-600 font-bold' : ''">1. Shipping Address</span>
            <span class="w-12 h-0.5" [ngClass]="currentStep() >= 2 ? 'bg-brand-600' : 'bg-slate-200'"></span>
            <span [ngClass]="currentStep() >= 2 ? 'text-brand-600 font-bold' : ''">2. Delivery Method</span>
            <span class="w-12 h-0.5" [ngClass]="currentStep() >= 3 ? 'bg-brand-600' : 'bg-slate-200'"></span>
            <span [ngClass]="currentStep() >= 3 ? 'text-brand-600 font-bold' : ''">3. Interactive Payment</span>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 font-heading">Secure Checkout</h1>
        </div>

        @if (completedOrder(); as order) {
          <!-- Order Confirmation Success View -->
          <div class="max-w-2xl mx-auto bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-xl text-center space-y-6 animate-scale-in">
            <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>

            <div>
              <span class="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                PAYMENT CONFIRMED
              </span>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-2">
                Thank You, {{ order.customer.name }}!
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-1">
                Your order has been placed and is being prepared for dispatch.
              </p>
            </div>

            <!-- Order Key Details Card -->
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-3">
              <div class="flex justify-between items-center text-xs">
                <span class="text-slate-500">Order ID:</span>
                <span class="font-bold text-slate-900 font-mono">{{ order.id }}</span>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="text-slate-500">Tracking Number:</span>
                <span class="font-bold text-brand-600 font-mono">{{ order.trackingNumber }}</span>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="text-slate-500">Estimated Delivery:</span>
                <span class="font-bold text-slate-900">{{ order.estimatedDelivery }}</span>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="text-slate-500">Payment Gateway:</span>
                <span class="font-bold text-slate-900">{{ order.paymentMethod }} ({{ order.paymentStatus }})</span>
              </div>
              <div class="flex justify-between items-center text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid:</span>
                <span class="text-brand-600 font-heading">\${{ order.total }}</span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                [routerLink]="['/track']"
                [queryParams]="{ tracking: order.trackingNumber }"
                class="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                </svg>
                <span>Track Live Order</span>
              </a>

              <a
                routerLink="/account"
                class="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Go to My Orders
              </a>
            </div>
          </div>
        } @else if (cartService.items().length === 0) {
          <div class="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto">
            <h3 class="text-lg font-bold text-slate-900 font-heading">Your shopping bag is empty</h3>
            <p class="text-xs text-slate-500 mt-1 mb-6">Add items to your bag before proceeding to checkout.</p>
            <a routerLink="/shop" class="px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl">
              Return to Catalog
            </a>
          </div>

        } @else {
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <!-- Left Flow (7 cols) -->
            <div class="lg:col-span-7 space-y-6">
              
              <!-- STEP 1: Shipping Address -->
              <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 class="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">1</span>
                    <span>Shipping Address</span>
                  </h3>
                  
                  @if (authService.user()?.savedAddresses?.length) {
                    <span class="text-xs text-brand-600 font-medium">Quick pick from saved addresses</span>
                  }
                </div>

                <!-- Saved Address Quick Selection Cards -->
                @if (authService.user()?.savedAddresses; as addrs) {
                  @if (addrs.length > 0) {
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      @for (addr of addrs; track addr.id) {
                        <div
                          (click)="selectSavedAddress(addr)"
                          class="p-4 rounded-2xl border-2 transition-all cursor-pointer relative"
                          [ngClass]="selectedAddressId === addr.id ? 'border-brand-600 bg-brand-50/30 ring-1 ring-brand-500' : 'border-slate-200 hover:border-slate-300'"
                        >
                          <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-bold text-slate-900">{{ addr.tag }}</span>
                            @if (addr.isDefault) {
                              <span class="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Default</span>
                            }
                          </div>
                          <p class="text-xs text-slate-800 font-semibold">{{ addr.fullName }}</p>
                          <p class="text-xs text-slate-500 mt-0.5">{{ addr.street }}</p>
                          <p class="text-xs text-slate-500">{{ addr.city }}, {{ addr.state }} - {{ addr.zip }}</p>
                          <p class="text-xs text-slate-500 mt-1 font-mono">{{ addr.phone }}</p>
                        </div>
                      }
                    </div>
                  }
                }

                <!-- Address Input Fields -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div class="sm:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      [(ngModel)]="shippingForm.name"
                      placeholder="e.g. Ashwin"
                      class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      [(ngModel)]="shippingForm.email"
                      placeholder="e.g. ashwin@example.com"
                      class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      [(ngModel)]="shippingForm.phone"
                      placeholder="e.g. +91 98765 43210"
                      class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div class="sm:col-span-2">
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      [(ngModel)]="shippingForm.street"
                      placeholder="House/Apt, Street name, Locality"
                      class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      [(ngModel)]="shippingForm.city"
                      placeholder="Bengaluru"
                      class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                    <input
                      type="text"
                      [(ngModel)]="shippingForm.state"
                      placeholder="Karnataka"
                      class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Postal / ZIP Code</label>
                    <input
                      type="text"
                      [(ngModel)]="shippingForm.zip"
                      placeholder="560038"
                      class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                    <input
                      type="text"
                      [(ngModel)]="shippingForm.country"
                      class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <!-- STEP 2: Shipping Method -->
              <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                <h3 class="text-lg font-bold text-slate-900 font-heading flex items-center gap-2 border-b border-slate-100 pb-4">
                  <span class="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">2</span>
                  <span>Delivery Method</span>
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3"
                    [ngClass]="selectedShippingMethod === 'free' ? 'border-brand-600 bg-brand-50/20' : 'border-slate-200'"
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="free"
                      [(ngModel)]="selectedShippingMethod"
                      class="accent-brand-600 mt-1"
                    />
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-900">Standard Delivery</span>
                        <span class="text-xs font-bold text-emerald-600">FREE</span>
                      </div>
                      <p class="text-xs text-slate-500 mt-0.5">3-5 business days via BlueDart Ground</p>
                    </div>
                  </label>

                  <label
                    class="p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3"
                    [ngClass]="selectedShippingMethod === 'express' ? 'border-brand-600 bg-brand-50/20' : 'border-slate-200'"
                  >
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      [(ngModel)]="selectedShippingMethod"
                      class="accent-brand-600 mt-1"
                    />
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-900">Priority Express</span>
                        <span class="text-xs font-bold text-slate-900">\$15</span>
                      </div>
                      <p class="text-xs text-slate-500 mt-0.5">1-2 business days with insured courier</p>
                    </div>
                  </label>
                </div>
              </div>

              <!-- STEP 3: Interactive Payment Gateway Integration -->
              <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                <div class="border-b border-slate-100 pb-4">
                  <h3 class="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">3</span>
                    <span>Interactive Payment Gateway</span>
                  </h3>
                  <p class="text-xs text-slate-500 mt-1">
                    Simulated payment interface with interactive transitions & 256-bit bank encryption preview
                  </p>
                </div>

                <!-- Payment Method Tabs -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    (click)="paymentType = 'card'"
                    class="p-3 rounded-2xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5"
                    [ngClass]="paymentType === 'card' ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs' : 'border-slate-200 hover:bg-slate-50 text-slate-700'"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    <span>Card</span>
                  </button>

                  <button
                    (click)="paymentType = 'upi'"
                    class="p-3 rounded-2xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5"
                    [ngClass]="paymentType === 'upi' ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs' : 'border-slate-200 hover:bg-slate-50 text-slate-700'"
                  >
                    <span class="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">₹</span>
                    <span>UPI / QR</span>
                  </button>

                  <button
                    (click)="paymentType = 'netbanking'"
                    class="p-3 rounded-2xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5"
                    [ngClass]="paymentType === 'netbanking' ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs' : 'border-slate-200 hover:bg-slate-50 text-slate-700'"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    <span>Net Banking</span>
                  </button>

                  <button
                    (click)="paymentType = 'cod'"
                    class="p-3 rounded-2xl border text-xs font-semibold transition-all flex flex-col items-center gap-1.5"
                    [ngClass]="paymentType === 'cod' ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs' : 'border-slate-200 hover:bg-slate-50 text-slate-700'"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    <span>Cash on Deliv.</span>
                  </button>
                </div>

                <!-- CARD PAYMENT SUB-VIEW: Interactive 3D Card Simulation -->
                @if (paymentType === 'card') {
                  <div class="space-y-6 animate-fade-in">
                    
                    <!-- Live Interactive Card Preview -->
                    <div class="relative w-full max-w-sm mx-auto h-48 rounded-2xl p-6 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 text-white shadow-xl flex flex-col justify-between overflow-hidden">
                      <div class="absolute -right-10 -bottom-10 w-44 h-44 bg-brand-500/20 rounded-full blur-2xl"></div>
                      
                      <div class="flex items-center justify-between relative z-10">
                        <span class="text-xs font-mono tracking-widest text-slate-400">AURA BLACK TIER</span>
                        <span class="text-sm font-extrabold tracking-wider font-heading">
                          {{ getCardBrand(cardNumber) }}
                        </span>
                      </div>

                      <div class="relative z-10 my-auto">
                        <p class="font-mono text-base tracking-widest text-slate-100">
                          {{ formatCardNumberDisplay(cardNumber) }}
                        </p>
                      </div>

                      <div class="flex items-end justify-between relative z-10 text-xs font-mono">
                        <div>
                          <p class="text-[9px] text-slate-400 uppercase tracking-wider">Card Holder</p>
                          <p class="font-semibold text-slate-200 uppercase truncate max-w-[160px]">
                            {{ cardHolder || 'ASHWIN' }}
                          </p>
                        </div>
                        <div class="text-right">
                          <p class="text-[9px] text-slate-400 uppercase tracking-wider">Expires</p>
                          <p class="font-semibold text-slate-200">{{ cardExpiry || '08/28' }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Card Form Inputs -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="sm:col-span-2">
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          [(ngModel)]="cardNumber"
                          maxlength="19"
                          placeholder="4242 4242 4242 4242"
                          class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                      </div>

                      <div class="sm:col-span-2">
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          [(ngModel)]="cardHolder"
                          placeholder="Ashwin"
                          class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl uppercase focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                      </div>

                      <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">Expiry Date (MM/YY)</label>
                        <input
                          type="text"
                          [(ngModel)]="cardExpiry"
                          maxlength="5"
                          placeholder="08/28"
                          class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                      </div>

                      <div>
                        <label class="block text-xs font-semibold text-slate-700 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          [(ngModel)]="cardCvv"
                          maxlength="4"
                          placeholder="•••"
                          class="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        />
                      </div>
                    </div>
                  </div>
                }

                <!-- UPI PAYMENT SUB-VIEW -->
                @if (paymentType === 'upi') {
                  <div class="space-y-4 animate-fade-in p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div class="flex items-center gap-3">
                      <div class="w-24 h-24 bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-center shadow-xs">
                        <!-- Simulated QR Code SVG -->
                        <svg class="w-20 h-20" viewBox="0 0 100 100" fill="currentColor">
                          <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z M22,22 h6 v6 h-6 z M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z M72,22 h6 v6 h-6 z M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z M22,72 h6 v6 h-6 z M50,15 h5 v10 h-5 z M50,45 h15 v5 h-15 z M70,55 h10 v10 h-10 z M55,75 h25 v15 h-25 z M85,75 h5 v15 h-5 z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 class="text-xs font-bold text-slate-900">Scan & Pay via Any UPI App</h4>
                        <p class="text-[11px] text-slate-500 mt-0.5">Supports Google Pay, PhonePe, Paytm, CRED & BHIM.</p>
                        <span class="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Instant Verification
                        </span>
                      </div>
                    </div>

                    <div class="pt-2">
                      <label class="block text-xs font-semibold text-slate-700 mb-1">Or Enter Virtual Payment Address (UPI ID)</label>
                      <input
                        type="text"
                        [(ngModel)]="upiIdInput"
                        placeholder="e.g. ashwin@okaxis or mobile@upi"
                        class="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                      />
                    </div>
                  </div>
                }

                <!-- NETBANKING SUB-VIEW -->
                @if (paymentType === 'netbanking') {
                  <div class="space-y-3 animate-fade-in">
                    <label class="block text-xs font-semibold text-slate-700">Choose Bank</label>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      @for (bank of ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Other Bank']; track bank) {
                        <button
                          (click)="selectedBank = bank"
                          class="p-2.5 rounded-xl border text-xs font-medium transition-all text-left"
                          [ngClass]="selectedBank === bank ? 'border-brand-600 bg-brand-50 font-bold text-brand-700' : 'border-slate-200 hover:bg-slate-50 text-slate-700'"
                        >
                          {{ bank }}
                        </button>
                      }
                    </div>
                  </div>
                }

                <!-- COD SUB-VIEW -->
                @if (paymentType === 'cod') {
                  <div class="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1 animate-fade-in">
                    <p class="font-bold">Cash on Delivery selected</p>
                    <p class="text-amber-800 leading-relaxed">
                      You can pay via Cash or UPI QR scan directly to the courier agent upon receiving your shipment.
                    </p>
                  </div>
                }

                <!-- Pay Button -->
                <button
                  (click)="startPaymentSimulation()"
                  [disabled]="isProcessingPayment()"
                  class="w-full py-4 bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span>Authorize & Pay \${{ orderTotal() }}</span>
                </button>

                <p class="text-center text-[11px] text-slate-600 flex items-center justify-center gap-1">
                  <span>Guaranteed Safe & Secure Checkout with 256-Bit SSL Encryption</span>
                </p>
              </div>
            </div>

            <!-- Right Summary Sidebar (5 cols) -->
            <div class="lg:col-span-5 space-y-6">
              <div class="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-5 sticky top-28">
                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 class="text-base font-bold text-slate-900 font-heading">Order Summary</h3>
                  <span class="text-xs font-semibold text-slate-500">{{ cartService.itemCount() }} items</span>
                </div>

                <!-- Items list -->
                <div class="space-y-3 max-h-64 overflow-y-auto pr-1 divide-y divide-slate-50">
                  @for (item of cartService.items(); track $index) {
                    <div class="pt-3 first:pt-0 flex items-center gap-3">
                      <img [src]="item.product.image" [alt]="item.product.name" class="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0" />
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-semibold text-slate-900 truncate">{{ item.product.name }}</p>
                        <p class="text-[10px] text-slate-500">Qty: {{ item.quantity }}</p>
                      </div>
                      <span class="text-xs font-bold text-slate-900 font-heading">\${{ item.product.price * item.quantity }}</span>
                    </div>
                  }
                </div>

                <!-- Financial breakdown -->
                <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div class="flex justify-between">
                    <span>Subtotal</span>
                    <span class="font-semibold text-slate-900">\${{ cartService.subtotal() }}</span>
                  </div>
                  @if (cartService.discountAmount() > 0) {
                    <div class="flex justify-between text-emerald-600">
                      <span>Promo Discount ({{ cartService.promoCode() }})</span>
                      <span class="font-semibold">-\${{ cartService.discountAmount() }}</span>
                    </div>
                  }
                  <div class="flex justify-between">
                    <span>Shipping</span>
                    <span class="font-semibold text-slate-900">
                      {{ shippingCost() === 0 ? 'FREE' : ('$' + shippingCost()) }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span>Estimated Tax</span>
                    <span class="font-semibold text-slate-900">\${{ cartService.tax() }}</span>
                  </div>
                  <div class="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-100 font-heading">
                    <span>Total Amount</span>
                    <span class="text-brand-600">\${{ orderTotal() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Interactive Payment Processing Gateway Modal with Mandatory Backdrop Blur -->
    @if (isProcessingPayment()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
        <div class="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-scale-in">
          
          <!-- Animated Spinner -->
          <div class="relative w-20 h-20 mx-auto">
            <div class="w-20 h-20 rounded-full border-4 border-slate-100 border-t-brand-600 animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-bold text-slate-900 font-heading">AURA Payment Gateway</h3>
            <p class="text-xs text-brand-600 font-semibold mt-1 animate-pulse">{{ paymentStatusStep() }}</p>
            <p class="text-[11px] text-slate-600 mt-2">Please do not refresh or close this browser window.</p>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              class="bg-brand-600 h-1.5 rounded-full transition-all duration-700 ease-out"
              [style.width.%]="paymentProgress()"
            ></div>
          </div>

          <div class="text-[10px] text-slate-600 flex items-center justify-center gap-1">
            <span>256-bit End-to-End Encrypted Handshake</span>
          </div>
        </div>
      </div>
    }
  `
})
export class CheckoutComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  orderService = inject(OrderService);
  toastService = inject(ToastService);
  private router = inject(Router);

  currentStep = signal(1);
  selectedAddressId = 'addr-1';
  selectedShippingMethod = 'free';

  shippingForm = {
    name: 'Ashwin',
    email: 'ashwin@example.com',
    phone: '+91 98765 43210',
    street: '42 Silicon Residency, 100ft Road, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zip: '560038',
    country: 'India'
  };

  // Payment State
  paymentType: 'card' | 'upi' | 'netbanking' | 'cod' = 'card';
  cardNumber = '4242 4242 4242 4242';
  cardHolder = 'Ashwin';
  cardExpiry = '08/28';
  cardCvv = '882';
  upiIdInput = 'ashwin@okaxis';
  selectedBank = 'HDFC Bank';

  // Modal simulation state
  isProcessingPayment = signal(false);
  paymentStatusStep = signal('Connecting to secure banking gateway...');
  paymentProgress = signal(25);
  completedOrder = signal<Order | null>(null);

  shippingCost = computed(() => {
    if (this.selectedShippingMethod === 'express') return 15;
    return this.cartService.shipping();
  });

  orderTotal = computed(() => {
    const discounted = Math.max(0, this.cartService.subtotal() - this.cartService.discountAmount());
    return +(discounted + this.shippingCost() + this.cartService.tax()).toFixed(2);
  });

  selectSavedAddress(addr: any): void {
    this.selectedAddressId = addr.id;
    this.shippingForm.name = addr.fullName;
    this.shippingForm.phone = addr.phone;
    this.shippingForm.street = addr.street;
    this.shippingForm.city = addr.city;
    this.shippingForm.state = addr.state;
    this.shippingForm.zip = addr.zip;
    this.shippingForm.country = addr.country;
  }

  getCardBrand(num: string): string {
    if (num.startsWith('4')) return 'VISA';
    if (num.startsWith('5')) return 'MASTERCARD';
    if (num.startsWith('3')) return 'AMEX';
    return 'VISA';
  }

  formatCardNumberDisplay(num: string): string {
    if (!num) return '•••• •••• •••• ••••';
    return num;
  }

  startPaymentSimulation(): void {
    if (this.cartService.items().length === 0) return;

    this.isProcessingPayment.set(true);
    this.paymentProgress.set(20);
    this.paymentStatusStep.set('Establishing 256-bit encrypted channel...');

    // Simulation timeline
    setTimeout(() => {
      this.paymentProgress.set(55);
      this.paymentStatusStep.set('Authenticating with payment provider & 3D Secure...');
    }, 1200);

    setTimeout(() => {
      this.paymentProgress.set(85);
      this.paymentStatusStep.set('Processing authorization tokens...');
    }, 2400);

    setTimeout(() => {
      this.paymentProgress.set(100);
      this.paymentStatusStep.set('Payment Authorized! Finalizing your order...');
      this.finalizeOrder();
    }, 3600);
  }

  private finalizeOrder(): void {
    const orderItems = this.cartService.items().map(it => ({
      id: it.product.id,
      name: it.product.name,
      price: it.product.price,
      quantity: it.quantity,
      color: it.selectedColor,
      size: it.selectedSize,
      image: it.product.image
    }));

    let paymentMethodName = 'Credit Card (Visa ending in 4242)';
    if (this.paymentType === 'upi') {
      paymentMethodName = `UPI (${this.upiIdInput || 'QR Pay'})`;
    } else if (this.paymentType === 'netbanking') {
      paymentMethodName = `Net Banking (${this.selectedBank})`;
    } else if (this.paymentType === 'cod') {
      paymentMethodName = 'Cash on Delivery';
    }

    const order = this.orderService.createOrder({
      customer: {
        name: this.shippingForm.name,
        email: this.shippingForm.email,
        phone: this.shippingForm.phone
      },
      shippingAddress: {
        street: this.shippingForm.street,
        city: this.shippingForm.city,
        state: this.shippingForm.state,
        zip: this.shippingForm.zip,
        country: this.shippingForm.country
      },
      paymentMethod: paymentMethodName,
      items: orderItems,
      subtotal: this.cartService.subtotal(),
      shipping: this.shippingCost(),
      tax: this.cartService.tax(),
      discount: this.cartService.discountAmount(),
      total: this.orderTotal()
    });

    this.cartService.clearCart();
    this.isProcessingPayment.set(false);
    this.completedOrder.set(order);

    this.toastService.show(
      'Order Confirmed!',
      `Order ${order.id} has been placed successfully.`,
      'success'
    );
  }
}
