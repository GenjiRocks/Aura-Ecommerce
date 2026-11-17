import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/ecommerce.models';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="group relative flex flex-col bg-white rounded-3xl p-3 border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300">
      
      <!-- Image Container -->
      <div class="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100">
        <a [routerLink]="['/product', product.id]" class="block w-full h-full">
          <img
            [src]="product.image"
            [alt]="product.name"
            loading="lazy"
            (error)="onImgError($event)"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </a>

        <!-- Badge (Top Left) -->
        @if (product.badge) {
          <div class="absolute top-3 left-3 z-10">
            <span
              class="px-2.5 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-md"
              [ngClass]="{
                'bg-slate-900/90 text-white': product.badge === 'Bestseller',
                'bg-emerald-500/90 text-white': product.badge === 'New Arrival' || product.badge === 'New',
                'bg-rose-500/90 text-white': product.badge === 'Sale' || product.badge === 'Top Rated',
                'bg-amber-500/90 text-white': product.badge === 'Trending' || product.badge === 'Staff Pick',
                'bg-slate-500/90 text-white': product.badge === 'Sold Out'
              }"
            >
              {{ product.badge }}
            </span>
          </div>
        }

        <!-- Top Right Actions: Wishlist -->
        <button
          (click)="toggleWishlist($event)"
          aria-label="Wishlist"
          class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-md backdrop-blur-md"
          [ngClass]="wishlistService.isWishlisted(product.id)
            ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
            : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500 hover:scale-105'"
        >
          <svg class="w-4 h-4" [attr.fill]="wishlistService.isWishlisted(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>

        <!-- Hover Overlay Bar (Quick View) -->
        <div class="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            (click)="openQuickView($event)"
            class="w-full py-2.5 px-4 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold tracking-wide rounded-xl shadow-lg backdrop-blur-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            Quick View
          </button>
        </div>
      </div>

      <!-- Details -->
      <div class="flex flex-col flex-1 p-2 pt-3">
        <!-- Category & Rating -->
        <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span class="font-medium text-slate-400 uppercase tracking-wider text-[11px]">{{ product.category }}</span>
          <div class="flex items-center gap-1 font-semibold text-slate-700">
            <svg class="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span>{{ product.rating }}</span>
            <span class="text-slate-400 text-[10px]">({{ product.reviewsCount }})</span>
          </div>
        </div>

        <!-- Name -->
        <a
          [routerLink]="['/product', product.id]"
          class="font-medium text-slate-900 text-sm hover:text-brand-600 transition-colors line-clamp-1 mb-2 font-heading"
        >
          {{ product.name }}
        </a>

        <!-- Colors Preview -->
        @if (product.colors && product.colors.length > 0) {
          <div class="flex items-center gap-1.5 mb-3">
            @for (c of product.colors; track c) {
              <span
                class="w-3 h-3 rounded-full border border-slate-300 shadow-xs"
                [style.background-color]="c"
              ></span>
            }
          </div>
        }

        <!-- Price & Add to Cart -->
        <div class="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
          <div class="flex items-baseline gap-1.5">
            <span class="text-lg font-bold text-slate-900 font-heading">\${{ product.price }}</span>
            @if (product.originalPrice && product.originalPrice > product.price) {
              <span class="text-xs text-slate-400 line-through">\${{ product.originalPrice }}</span>
            }
          </div>

          <button
            (click)="addToCart($event)"
            [disabled]="!product.inStock"
            aria-label="Add to cart"
            class="p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all duration-200"
            [ngClass]="product.inStock
              ? 'bg-slate-900 text-white hover:bg-brand-600 active:scale-95 shadow-sm'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
          >
            @if (product.inStock) {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            } @else {
              <span class="text-[10px] px-1">Out of stock</span>
            }
          </button>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  productService = inject(ProductService);

  toggleWishlist(event: MouseEvent): void {
    event.stopPropagation();
    this.wishlistService.toggle(this.product);
  }

  openQuickView(event: MouseEvent): void {
    event.stopPropagation();
    this.productService.openQuickView(this.product);
  }

  addToCart(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.product.inStock) return;
    this.cartService.addToCart(this.product, 1);
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('photo-1505740420928')) {
      target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop';
    }
  }
}
