import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="bg-slate-50 min-h-screen py-10 md:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div class="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 mb-1">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>Saved For Later</span>
            </div>
            <h1 class="text-3xl font-extrabold text-slate-900 font-heading">My Wishlist</h1>
            <p class="text-xs text-slate-500 mt-1">
              {{ wishlistService.itemCount() }} {{ wishlistService.itemCount() === 1 ? 'item' : 'items' }} saved in your personal wishlist
            </p>
          </div>

          @if (wishlistService.itemCount() > 0) {
            <div class="flex items-center gap-3">
              <button
                (click)="addAllToCart()"
                class="px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <span>Move All to Bag</span>
              </button>

              <button
                (click)="wishlistService.clear()"
                class="px-4 py-2.5 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold rounded-xl transition-all"
              >
                Clear All
              </button>
            </div>
          }
        </div>

        <!-- Wishlist Grid or Empty State -->
        @if (wishlistService.itemCount() === 0) {
          <div class="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-12">
            <div class="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900 font-heading">Your wishlist is empty</h3>
            <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Save your favorite items by tapping the heart icon on any product card while browsing.
            </p>
            <a
              routerLink="/shop"
              class="inline-block mt-6 px-6 py-2.5 bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
            >
              Discover Products
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            @for (prod of wishlistService.items(); track prod.id) {
              <div class="relative">
                <app-product-card [product]="prod" />
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class WishlistComponent {
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);

  addAllToCart(): void {
    for (const prod of this.wishlistService.items()) {
      if (prod.inStock) {
        this.cartService.addToCart(prod, 1);
      }
    }
    this.wishlistService.clear();
    this.cartService.openDrawer();
  }
}
