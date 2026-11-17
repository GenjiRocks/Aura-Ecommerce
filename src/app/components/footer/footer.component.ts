import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Value Badges Bar -->
    <div class="border-t border-b border-slate-200/80 bg-white py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
              </svg>
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-900 uppercase tracking-wide">Free Global Shipping</h5>
              <p class="text-xs text-slate-500 mt-0.5">On all orders over \$100</p>
            </div>
          </div>

          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-900 uppercase tracking-wide">30-Day Guarantee</h5>
              <p class="text-xs text-slate-500 mt-0.5">Hassle-free return policy</p>
            </div>
          </div>

          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-900 uppercase tracking-wide">Encrypted Checkout</h5>
              <p class="text-xs text-slate-500 mt-0.5">256-bit bank grade security</p>
            </div>
          </div>

          <div class="flex items-center gap-3.5">
            <div class="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
              </svg>
            </div>
            <div>
              <h5 class="text-xs font-bold text-slate-900 uppercase tracking-wide">24/7 Concierge</h5>
              <p class="text-xs text-slate-500 mt-0.5">Dedicated specialist support</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Footer -->
    <footer class="bg-slate-950 text-slate-300 pt-16 pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          <!-- Column 1: Brand Info -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold">A</div>
              <span class="text-xl font-extrabold text-white font-heading tracking-tight">AURA</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed max-w-sm">
              Curated precision hardware, modern streetwear, and workspace essentials designed for high performance, intentional living, and timeless aesthetics.
            </p>
            
            <!-- Newsletter -->
            <div class="pt-2">
              <p class="text-xs font-semibold text-slate-200 mb-2">Join the Aura Inner Circle</p>
              <form (submit)="subscribeNewsletter($event)" class="flex gap-2 max-w-md">
                <input
                  type="email"
                  [(ngModel)]="emailInput"
                  name="email"
                  placeholder="Enter your email"
                  class="flex-1 px-3.5 py-2 text-xs bg-slate-900 text-white border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 placeholder:text-slate-500"
                  required
                />
                <button
                  type="submit"
                  class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95"
                >
                  Join
                </button>
              </form>
              <p class="text-[10px] text-slate-500 mt-1.5">No spam ever. Unsubscribe anytime with 1-click.</p>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Shop Collections</h4>
            <ul class="space-y-2.5 text-xs text-slate-400">
              <li><a routerLink="/shop" [queryParams]="{ category: 'Electronics' }" class="hover:text-white transition-colors">Audio & Computing</a></li>
              <li><a routerLink="/shop" [queryParams]="{ category: 'Fashion & Apparel' }" class="hover:text-white transition-colors">Apparel & Footwear</a></li>
              <li><a routerLink="/shop" [queryParams]="{ category: 'Home & Workspace' }" class="hover:text-white transition-colors">Workspace & Living</a></li>
              <li><a routerLink="/shop" [queryParams]="{ category: 'Accessories & Gear' }" class="hover:text-white transition-colors">Bags & Everyday Carry</a></li>
              <li><a routerLink="/shop" class="hover:text-white transition-colors">All New Arrivals</a></li>
            </ul>
          </div>

          <!-- Column 3: Customer Service -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul class="space-y-2.5 text-xs text-slate-400">
              <li><a routerLink="/track" class="hover:text-white transition-colors">Order Tracking</a></li>
              <li><a routerLink="/account" class="hover:text-white transition-colors">Account Dashboard</a></li>
              <li><a routerLink="/wishlist" class="hover:text-white transition-colors">My Wishlist</a></li>
              <li><a routerLink="/checkout" class="hover:text-white transition-colors">Instant Checkout</a></li>
              <li><a routerLink="/admin" class="hover:text-white transition-colors">Store Admin Area</a></li>
            </ul>
          </div>

          <!-- Column 4: Trust & Contact -->
          <div>
            <h4 class="text-xs font-bold text-white uppercase tracking-wider mb-4">Store Location</h4>
            <p class="text-xs text-slate-400 leading-relaxed mb-3">
              Indiranagar 100ft Road<br />
              Bengaluru, Karnataka 560038<br />
              India
            </p>
            <p class="text-xs text-slate-400">
              support&#64;aurastore.com<br />
              +91 (080) 4920-AURA
            </p>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; 2026 AURA Store Inc. All rights reserved. Crafted with precision.</p>

          <!-- Payment badges -->
          <div class="flex items-center gap-3">
            <span class="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-bold text-[10px] text-slate-300">VISA</span>
            <span class="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-bold text-[10px] text-slate-300">MASTERCARD</span>
            <span class="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-bold text-[10px] text-emerald-400">UPI</span>
            <span class="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-bold text-[10px] text-slate-300">APPLE PAY</span>
            <span class="px-2 py-1 bg-slate-900 border border-slate-800 rounded font-bold text-[10px] text-sky-400">PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  private toast = inject(ToastService);
  emailInput = '';

  subscribeNewsletter(e: Event): void {
    e.preventDefault();
    if (!this.emailInput.trim()) return;

    this.toast.show(
      'Subscribed!',
      `Thank you for subscribing (${this.emailInput}). Welcome voucher WELCOME20 has been unlocked!`,
      'success'
    );
    this.emailInput = '';
  }
}
