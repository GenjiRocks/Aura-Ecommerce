import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/ecommerce.models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    @if (product(); as prod) {
      <div class="bg-slate-50 min-h-screen py-8 md:py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <a routerLink="/" class="hover:text-slate-900 transition-colors">Home</a>
            <span>/</span>
            <a routerLink="/shop" class="hover:text-slate-900 transition-colors">Shop</a>
            <span>/</span>
            <a [routerLink]="['/shop']" [queryParams]="{ category: prod.category }" class="hover:text-slate-900 transition-colors">
              {{ prod.category }}
            </a>
            <span>/</span>
            <span class="text-slate-900 font-semibold truncate">{{ prod.name }}</span>
          </nav>

          <!-- Main Product Presentation Card -->
          <div class="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm mb-12">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              <!-- Left Gallery (5 cols) -->
              <div class="lg:col-span-6 space-y-4">
                <div class="w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 relative group shadow-inner">
                  <img
                    [src]="selectedImage() || prod.image"
                    [alt]="prod.name"
                    (error)="onImgError($event)"
                    class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  @if (prod.badge) {
                    <div class="absolute top-4 left-4">
                      <span class="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full shadow-md">
                        {{ prod.badge }}
                      </span>
                    </div>
                  }
                </div>

                <!-- Thumbnails -->
                @if (prod.images && prod.images.length > 1) {
                  <div class="flex gap-3 overflow-x-auto pb-2">
                    @for (img of prod.images; track img) {
                      <button
                        (click)="selectedImage.set(img)"
                        class="w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50"
                        [ngClass]="(selectedImage() || prod.image) === img ? 'border-brand-600 ring-2 ring-brand-100' : 'border-slate-200 opacity-70 hover:opacity-100'"
                      >
                        <img [src]="img" class="w-full h-full object-cover" />
                      </button>
                    }
                  </div>
                }
              </div>

              <!-- Right Product Details (7 cols) -->
              <div class="lg:col-span-6 flex flex-col">
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold uppercase tracking-wider text-brand-600">
                      {{ prod.category }}
                    </span>
                    <span
                      class="px-2.5 py-0.5 text-xs font-semibold rounded-full"
                      [ngClass]="prod.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
                    >
                      {{ prod.inStock ? ('In Stock (' + prod.stockQuantity + ' left)') : 'Out of Stock' }}
                    </span>
                  </div>

                  <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading leading-tight">
                    {{ prod.name }}
                  </h1>

                  <!-- Rating -->
                  <div class="flex items-center gap-2">
                    <div class="flex items-center text-amber-400">
                      @for (star of [1,2,3,4,5]; track star) {
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      }
                    </div>
                    <span class="text-xs font-bold text-slate-800">{{ prod.rating }}</span>
                    <span class="text-xs text-slate-400 font-medium">({{ prod.reviewsCount }} verified customer reviews)</span>
                  </div>

                  <!-- Price -->
                  <div class="flex items-baseline gap-3 pt-2">
                    <span class="text-3xl font-extrabold text-slate-900 font-heading">\${{ prod.price }}</span>
                    @if (prod.originalPrice && prod.originalPrice > prod.price) {
                      <span class="text-lg text-slate-400 line-through">\${{ prod.originalPrice }}</span>
                      <span class="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-full">
                        {{ getDiscountPercent(prod.price, prod.originalPrice) }}% OFF
                      </span>
                    }
                  </div>

                  <!-- Short Description -->
                  <p class="text-sm text-slate-600 leading-relaxed pt-2">
                    {{ prod.description }}
                  </p>

                  <!-- Key Features checklist -->
                  @if (prod.features && prod.features.length > 0) {
                    <div class="pt-2">
                      <h4 class="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Key Highlights</h4>
                      <ul class="space-y-1.5">
                        @for (feat of prod.features; track feat) {
                          <li class="flex items-start gap-2 text-xs text-slate-600">
                            <svg class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span>{{ feat }}</span>
                          </li>
                        }
                      </ul>
                    </div>
                  }

                  <!-- Colors -->
                  @if (prod.colors && prod.colors.length > 0) {
                    <div class="pt-3">
                      <label class="block text-xs font-bold text-slate-900 mb-2">Color Variant</label>
                      <div class="flex items-center gap-2">
                        @for (c of prod.colors; track c) {
                          <button
                            (click)="selectedColor.set(c)"
                            class="w-7 h-7 rounded-full border-2 transition-transform shadow-xs"
                            [style.background-color]="c"
                            [ngClass]="selectedColor() === c ? 'ring-2 ring-brand-500 ring-offset-2 scale-110' : 'opacity-80 hover:opacity-100'"
                          ></button>
                        }
                      </div>
                    </div>
                  }

                  <!-- Sizes -->
                  @if (prod.sizes && prod.sizes.length > 0) {
                    <div class="pt-3">
                      <label class="block text-xs font-bold text-slate-900 mb-2">Select Size</label>
                      <div class="flex flex-wrap gap-2">
                        @for (s of prod.sizes; track s) {
                          <button
                            (click)="selectedSize.set(s)"
                            class="px-4 py-2 text-xs font-semibold rounded-xl border transition-all"
                            [ngClass]="selectedSize() === s ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'"
                          >
                            {{ s }}
                          </button>
                        }
                      </div>
                    </div>
                  }

                  <!-- Add to Cart & Buy Now Buttons -->
                  <div class="pt-6 border-t border-slate-100 space-y-3">
                    <div class="flex items-center gap-4">
                      <!-- Stepper -->
                      <div class="flex items-center border border-slate-200 rounded-2xl bg-slate-50 overflow-hidden h-12 shrink-0">
                        <button
                          (click)="decrementQty()"
                          class="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          -
                        </button>
                        <span class="w-10 text-center text-xs font-bold text-slate-900">{{ quantity() }}</span>
                        <button
                          (click)="incrementQty()"
                          class="w-10 h-full flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <!-- Add to Bag -->
                      <button
                        (click)="addToCart(prod)"
                        [disabled]="!prod.inStock"
                        class="flex-1 h-12 bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                        </svg>
                        <span>{{ prod.inStock ? 'Add to Shopping Bag' : 'Sold Out' }}</span>
                      </button>

                      <!-- Wishlist -->
                      <button
                        (click)="wishlistService.toggle(prod)"
                        class="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center transition-colors shrink-0"
                        [ngClass]="wishlistService.isWishlisted(prod.id) ? 'bg-rose-50 text-rose-500 border-rose-200' : 'hover:bg-slate-50 text-slate-600'"
                      >
                        <svg class="w-5 h-5" [attr.fill]="wishlistService.isWishlisted(prod.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </button>
                    </div>

                    <!-- Buy Now Button -->
                    @if (prod.inStock) {
                      <button
                        (click)="buyNow(prod)"
                        class="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-98"
                      >
                        Instant Buy &bull; Proceed to Checkout
                      </button>
                    }
                  </div>

                  <!-- Shipping & Warranty Perks -->
                  <div class="grid grid-cols-2 gap-3 pt-4 text-xs text-slate-500">
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Free Express Delivery over \$100</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>2-Year Comprehensive Warranty</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>30-Day Hassle-Free Returns</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      <span>Authentic & Sealed Direct from Brand</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabbed Specifications & Customer Reviews -->
          <div class="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm mb-12">
            <div class="flex border-b border-slate-100 gap-6 mb-6">
              <button
                (click)="activeTab.set('details')"
                class="pb-3 text-sm font-bold transition-all relative font-heading"
                [ngClass]="activeTab() === 'details' ? 'text-slate-900 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-700'"
              >
                Detailed Specifications
              </button>
              <button
                (click)="activeTab.set('shipping')"
                class="pb-3 text-sm font-bold transition-all relative font-heading"
                [ngClass]="activeTab() === 'shipping' ? 'text-slate-900 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-700'"
              >
                Shipping & Returns
              </button>
              <button
                (click)="activeTab.set('reviews')"
                class="pb-3 text-sm font-bold transition-all relative font-heading"
                [ngClass]="activeTab() === 'reviews' ? 'text-slate-900 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-700'"
              >
                Customer Reviews ({{ prod.reviewsCount }})
              </button>
            </div>

            @if (activeTab() === 'details') {
              <div class="space-y-4 text-xs text-slate-600 leading-relaxed max-w-3xl">
                <p>
                  Every piece in the AURA collection is engineered to exacting standards of craftsmanship, sustainable materials, and acoustic/physical ergonomics.
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span class="font-bold text-slate-900 block mb-1">Materials</span>
                    <span>Anodized Aerospace Aluminum, GOTS organic textiles, antimicrobial silicones.</span>
                  </div>
                  <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span class="font-bold text-slate-900 block mb-1">Origin & Quality</span>
                    <span>Designed in California, assembled with certified zero-landfill partner factories.</span>
                  </div>
                </div>
              </div>
            } @else if (activeTab() === 'shipping') {
              <div class="space-y-3 text-xs text-slate-600 max-w-3xl leading-relaxed">
                <p><strong>Standard Global Delivery:</strong> 3-5 business days via BlueDart / FedEx Priority.</p>
                <p><strong>Carbon-Neutral Packing:</strong> 100% recyclable FSC-certified honeycomb paper packaging.</p>
                <p><strong>Returns:</strong> We offer a 30-day trial period. If you're not completely in love with your item, send it back for a full refund or exchange with complimentary return labels.</p>
              </div>
            } @else {
              <div class="space-y-4 max-w-3xl">
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-slate-900">Rohan M. &bull; Verified Buyer</span>
                    <span class="text-xs text-slate-400">2 days ago</span>
                  </div>
                  <div class="flex items-center text-amber-400">
                    ★★★★★
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    "Exceptional quality. The tactile finish and attention to detail surpassed my expectations. Easily worth every penny."
                  </p>
                </div>

                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-xs text-slate-900">Sarah K. &bull; Verified Buyer</span>
                    <span class="text-xs text-slate-400">1 week ago</span>
                  </div>
                  <div class="flex items-center text-amber-400">
                    ★★★★★
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed">
                    "Super quick dispatch and the packaging was museum-grade. Will definitely be coming back for more additions to my desk setup."
                  </p>
                </div>
              </div>
            }
          </div>

          <!-- Related Products Carousel -->
          <div>
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-slate-900 font-heading">You May Also Like</h3>
              <a routerLink="/shop" class="text-xs font-semibold text-brand-600 hover:underline">Explore More</a>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              @for (related of relatedProducts(); track related.id) {
                <app-product-card [product]="related" />
              }
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 class="text-2xl font-bold text-slate-900 font-heading">Product Not Found</h2>
        <p class="text-xs text-slate-500 mt-2">The product you are looking for does not exist or has been removed.</p>
        <a routerLink="/shop" class="mt-6 px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl">
          Return to Shop
        </a>
      </div>
    }
  `
})
export class ProductDetailComponent implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  product = signal<Product | null>(null);
  selectedImage = signal<string | null>(null);
  selectedColor = signal<string | null>(null);
  selectedSize = signal<string | null>(null);
  quantity = signal<number>(1);
  activeTab = signal<'details' | 'shipping' | 'reviews'>('details');

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const found = this.productService.getProductById(id) || this.productService.getProductBySlug(id);
        if (found) {
          this.product.set(found);
          this.selectedImage.set(found.image);
          this.selectedColor.set(found.colors?.[0] || null);
          this.selectedSize.set(found.sizes?.[0] || null);
          this.quantity.set(1);
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      }
    });
  }

  getDiscountPercent(price: number, originalPrice: number): number {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  incrementQty(): void {
    this.quantity.update(q => q + 1);
  }

  decrementQty(): void {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart(prod: Product): void {
    this.cartService.addToCart(
      prod,
      this.quantity(),
      this.selectedColor() || undefined,
      this.selectedSize() || undefined
    );
  }

  buyNow(prod: Product): void {
    this.cartService.addToCart(
      prod,
      this.quantity(),
      this.selectedColor() || undefined,
      this.selectedSize() || undefined
    );
    this.router.navigate(['/checkout']);
  }

  relatedProducts = () => {
    const current = this.product();
    if (!current) return [];
    return this.productService.products()
      .filter(p => p.id !== current.id)
      .slice(0, 4);
  };

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && !target.src.includes('photo-1505740420928')) {
      target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop';
    }
  }
}
