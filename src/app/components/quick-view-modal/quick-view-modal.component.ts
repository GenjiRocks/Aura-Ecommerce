import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-quick-view-modal',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (productService.quickViewProduct(); as product) {
      <!-- Backdrop with mandatory blur -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md transition-all animate-fade-in"
        (click)="productService.closeQuickView()"
      >
        <!-- Modal Card -->
        <div
          class="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-in"
          (click)="$event.stopPropagation()"
        >
          <!-- Close Button -->
          <button
            (click)="productService.closeQuickView()"
            class="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/80 hover:bg-slate-100 text-slate-500 hover:text-slate-800 backdrop-blur-md flex items-center justify-center transition-colors shadow-sm"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2">
            <!-- Left: Gallery -->
            <div class="p-6 bg-slate-50 flex flex-col justify-between">
              <div class="w-full aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-inner">
                <img
                  [src]="selectedImage || product.image"
                  [alt]="product.name"
                  (error)="onImgError($event)"
                  class="w-full h-full object-cover object-center transition-all duration-300"
                />
              </div>

              <!-- Thumbnails -->
              @if (product.images && product.images.length > 1) {
                <div class="flex gap-2 mt-4 overflow-x-auto pb-1">
                  @for (img of product.images; track img) {
                    <button
                      (click)="selectedImage = img"
                      class="w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0"
                      [ngClass]="(selectedImage || product.image) === img ? 'border-brand-600 ring-2 ring-brand-100' : 'border-slate-200 opacity-70 hover:opacity-100'"
                    >
                      <img [src]="img" class="w-full h-full object-cover" />
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Right: Details -->
            <div class="p-6 md:p-8 flex flex-col">
              <div class="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-1">
                {{ product.category }}
              </div>

              <h2 class="text-xl md:text-2xl font-bold text-slate-900 font-heading mb-2">
                {{ product.name }}
              </h2>

              <!-- Rating -->
              <div class="flex items-center gap-2 mb-4">
                <div class="flex items-center text-amber-400">
                  @for (star of [1,2,3,4,5]; track star) {
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  }
                </div>
                <span class="text-xs font-semibold text-slate-700">{{ product.rating }}</span>
                <span class="text-xs text-slate-400">({{ product.reviewsCount }} reviews)</span>
              </div>

              <!-- Price -->
              <div class="flex items-baseline gap-3 mb-4">
                <span class="text-2xl font-extrabold text-slate-900 font-heading">\${{ product.price }}</span>
                @if (product.originalPrice && product.originalPrice > product.price) {
                  <span class="text-sm text-slate-400 line-through">\${{ product.originalPrice }}</span>
                  <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Save \${{ product.originalPrice - product.price }}
                  </span>
                }
              </div>

              <!-- Description -->
              <p class="text-xs text-slate-600 leading-relaxed mb-5 line-clamp-3">
                {{ product.description }}
              </p>

              <!-- Color options -->
              @if (product.colors && product.colors.length > 0) {
                <div class="mb-4">
                  <label class="block text-xs font-semibold text-slate-700 mb-2">Color Variant</label>
                  <div class="flex items-center gap-2">
                    @for (c of product.colors; track c) {
                      <button
                        (click)="selectedColor = c"
                        class="w-6 h-6 rounded-full border-2 transition-transform shadow-xs"
                        [style.background-color]="c"
                        [ngClass]="(selectedColor || product.colors[0]) === c ? 'ring-2 ring-brand-500 ring-offset-2 scale-110' : 'opacity-80 hover:opacity-100'"
                      ></button>
                    }
                  </div>
                </div>
              }

              <!-- Size options -->
              @if (product.sizes && product.sizes.length > 0) {
                <div class="mb-5">
                  <label class="block text-xs font-semibold text-slate-700 mb-2">Size</label>
                  <div class="flex flex-wrap gap-2">
                    @for (s of product.sizes; track s) {
                      <button
                        (click)="selectedSize = s"
                        class="px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all"
                        [ngClass]="(selectedSize || product.sizes[0]) === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'"
                      >
                        {{ s }}
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Actions: Stepper + Add to Cart -->
              <div class="mt-auto pt-4 border-t border-slate-100 flex items-center gap-3">
                <div class="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden h-11 shrink-0">
                  <button
                    (click)="decrementQty()"
                    class="w-9 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    -
                  </button>
                  <span class="w-10 text-center text-xs font-bold text-slate-900">{{ quantity }}</span>
                  <button
                    (click)="incrementQty()"
                    class="w-9 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  (click)="addToCart(product)"
                  [disabled]="!product.inStock"
                  class="flex-1 h-11 bg-slate-900 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                  </svg>
                  <span>{{ product.inStock ? 'Add to Bag' : 'Out of Stock' }}</span>
                </button>

                <button
                  (click)="wishlistService.toggle(product)"
                  class="w-11 h-11 rounded-xl border border-slate-200 flex items-center justify-center transition-colors shrink-0"
                  [ngClass]="wishlistService.isWishlisted(product.id) ? 'bg-rose-50 text-rose-500 border-rose-200' : 'hover:bg-slate-50 text-slate-600'"
                >
                  <svg class="w-5 h-5" [attr.fill]="wishlistService.isWishlisted(product.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>

              <!-- View full details link -->
              <div class="mt-4 text-center">
                <a
                  [routerLink]="['/product', product.id]"
                  (click)="productService.closeQuickView()"
                  class="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>View Complete Details & Specifications</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class QuickViewModalComponent {
  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  selectedImage: string | null = null;
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  quantity = 1;

  incrementQty(): void {
    this.quantity++;
  }

  decrementQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(product: any): void {
    this.cartService.addToCart(
      product,
      this.quantity,
      this.selectedColor || undefined,
      this.selectedSize || undefined
    );
    this.productService.closeQuickView();
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('photo-1505740420928')) {
      target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop';
    }
  }
}
