import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    @if (cartService.isOpen()) {
      <!-- Backdrop with mandatory blur requested by user -->
      <div
        class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md transition-opacity animate-fade-in"
        (click)="cartService.closeDrawer()"
      ></div>

      <!-- Slide-over Drawer Panel -->
      <div
        class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-slide-up sm:animate-none"
      >
        <!-- Header -->
        <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-bold text-slate-900 font-heading">Shopping Bag</h3>
            <span class="px-2 py-0.5 text-xs font-semibold bg-brand-50 text-brand-600 rounded-full">
              {{ cartService.itemCount() }} {{ cartService.itemCount() === 1 ? 'item' : 'items' }}
            </span>
          </div>

          <button
            (click)="cartService.closeDrawer()"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close cart"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Free Shipping Progress -->
        <div class="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100">
          @if (cartService.subtotal() >= cartService.freeShippingThreshold) {
            <div class="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>Congratulations! You unlocked FREE Express Delivery!</span>
            </div>
          } @else {
            <div class="flex justify-between text-xs text-slate-600 font-medium mb-1.5">
              <span>Add <strong class="text-brand-600">\${{ cartService.freeShippingRemaining() }}</strong> more for FREE shipping</span>
              <span class="font-semibold text-slate-900">{{ cartService.freeShippingProgress() }}%</span>
            </div>
          }
          <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              class="bg-brand-600 h-1.5 rounded-full transition-all duration-500 ease-out"
              [style.width.%]="cartService.freeShippingProgress()"
            ></div>
          </div>
        </div>

        <!-- Items List -->
        <div class="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
          @if (cartService.items().length === 0) {
            <div class="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div class="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center text-brand-500 mb-4">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
              </div>
              <h4 class="text-base font-semibold text-slate-900 font-heading">Your bag is empty</h4>
              <p class="text-xs text-slate-500 mt-1 max-w-xs">
                Looks like you haven't added anything to your cart yet. Explore our curated collections!
              </p>
              <button
                (click)="goToShop()"
                class="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-all shadow-md active:scale-95"
              >
                Start Exploring
              </button>
            </div>
          } @else {
            @for (item of cartService.items(); track $index) {
              <div class="py-4 flex gap-4 items-start group">
                <!-- Thumbnail -->
                <div class="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img
                    [src]="item.product.image"
                    [alt]="item.product.name"
                    class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
                  />
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start gap-2">
                    <a
                      [routerLink]="['/product', item.product.id]"
                      (click)="cartService.closeDrawer()"
                      class="text-sm font-semibold text-slate-900 hover:text-brand-600 truncate transition-colors font-heading"
                    >
                      {{ item.product.name }}
                    </a>
                    <button
                      (click)="cartService.removeItem($index)"
                      class="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                      aria-label="Remove item"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Color / Size tag -->
                  <div class="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    @if (item.selectedColor) {
                      <div class="flex items-center gap-1">
                        <span class="w-2.5 h-2.5 rounded-full border border-slate-300" [style.background-color]="item.selectedColor"></span>
                        <span>Color</span>
                      </div>
                    }
                    @if (item.selectedSize) {
                      <span>&bull; Size: {{ item.selectedSize }}</span>
                    }
                  </div>

                  <!-- Price & Stepper -->
                  <div class="flex items-center justify-between mt-3">
                    <span class="text-sm font-bold text-slate-900 font-heading">
                      \${{ item.product.price * item.quantity }}
                    </span>

                    <!-- Quantity Stepper -->
                    <div class="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button
                        (click)="cartService.updateQuantity($index, item.quantity - 1)"
                        class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                        aria-label="Decrease"
                      >
                        -
                      </button>
                      <span class="w-8 text-center text-xs font-semibold text-slate-800">{{ item.quantity }}</span>
                      <button
                        (click)="cartService.updateQuantity($index, item.quantity + 1)"
                        class="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Footer / Checkout Area -->
        @if (cartService.items().length > 0) {
          <div class="p-5 border-t border-slate-100 bg-slate-50/50 space-y-4">
            
            <!-- Promo code input -->
            <div class="flex gap-2">
              <input
                type="text"
                [(ngModel)]="couponInput"
                placeholder="Discount code (try WELCOME20)"
                class="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all uppercase placeholder:normal-case"
              />
              <button
                (click)="applyCoupon()"
                class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all"
              >
                Apply
              </button>
            </div>

            <!-- Active coupon badge -->
            @if (cartService.promoCode()) {
              <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                <div class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                  <span>Code <strong>{{ cartService.promoCode() }}</strong> applied (-{{ cartService.discountRate() * 100 }}%)</span>
                </div>
                <button (click)="cartService.removePromoCode()" class="text-xs text-emerald-700 hover:text-emerald-950 font-bold">
                  &times;
                </button>
              </div>
            }

            <!-- Summary Breakdown -->
            <div class="space-y-1.5 text-xs text-slate-600">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span class="font-semibold text-slate-900">\${{ cartService.subtotal() }}</span>
              </div>
              @if (cartService.discountAmount() > 0) {
                <div class="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span class="font-semibold">-\${{ cartService.discountAmount() }}</span>
                </div>
              }
              <div class="flex justify-between">
                <span>Estimated Shipping</span>
                <span class="font-semibold text-slate-900">
                  {{ cartService.shipping() === 0 ? 'FREE' : ('$' + cartService.shipping()) }}
                </span>
              </div>
              <div class="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span class="font-semibold text-slate-900">\${{ cartService.tax() }}</span>
              </div>
              <div class="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200 font-heading">
                <span>Total Amount</span>
                <span class="text-base text-brand-600">\${{ cartService.total() }}</span>
              </div>
            </div>

            <!-- Checkout Button -->
            <button
              (click)="proceedToCheckout()"
              class="w-full py-3.5 px-4 bg-slate-900 hover:bg-brand-600 text-white font-semibold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Proceed to Checkout</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>
          </div>
        }
      </div>
    }
  `
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  couponInput = '';

  applyCoupon(): void {
    if (!this.couponInput.trim()) return;
    const res = this.cartService.applyPromoCode(this.couponInput);
    if (res.success) {
      this.couponInput = '';
    }
  }

  proceedToCheckout(): void {
    this.cartService.closeDrawer();
    this.router.navigate(['/checkout']);
  }

  goToShop(): void {
    this.cartService.closeDrawer();
    this.router.navigate(['/shop']);
  }
}
