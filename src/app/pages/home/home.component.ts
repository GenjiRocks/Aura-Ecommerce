import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <!-- Hero Section with Modern Fluid Visuals -->
    <section class="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white pt-12 pb-24 md:pt-20 md:pb-32">
      <!-- Ambient Glow Highlights -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div class="absolute bottom-10 right-10 w-[400px] h-[300px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Hero Copy -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-brand-300">
              <span class="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
              <span>New Spring Edition &bull; 2026 Collection Dropped</span>
            </div>

            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight sm:leading-none text-white">
              Elegance In Every Detail. <br class="hidden sm:inline" />
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-sky-200 to-indigo-300">
                Precision Hardware & Style.
              </span>
            </h1>

            <p class="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Experience thoughtfully designed audio, computing gear, minimalist apparel, and workspace essentials curated for modern creators and thinkers.
            </p>

            <!-- Hero CTAs -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                routerLink="/shop"
                class="px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-2xl shadow-xl transition-all duration-200 flex items-center gap-2 active:scale-95 group"
              >
                <span>Explore Catalog</span>
                <svg class="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </a>

              <a
                routerLink="/shop"
                [queryParams]="{ filter: 'bestseller' }"
                class="px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-2xl backdrop-blur-md border border-white/20 transition-all duration-200 flex items-center gap-2 active:scale-95"
              >
                <span>View Bestsellers</span>
              </a>
            </div>

            <!-- Trust Metrics -->
            <div class="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p class="text-2xl font-bold font-heading text-white">50K+</p>
                <p class="text-xs text-slate-400 mt-0.5">Satisfied Clients</p>
              </div>
              <div>
                <p class="text-2xl font-bold font-heading text-white">4.9 / 5</p>
                <p class="text-xs text-slate-400 mt-0.5">Verified Reviews</p>
              </div>
              <div>
                <p class="text-2xl font-bold font-heading text-white">100%</p>
                <p class="text-xs text-slate-400 mt-0.5">Carbon Neutral</p>
              </div>
            </div>
          </div>

          <!-- Hero Media Card Showcase -->
          <div class="lg:col-span-5 relative">
            <div class="relative mx-auto max-w-md bg-gradient-to-tr from-white/10 to-white/5 p-4 rounded-3xl border border-white/15 backdrop-blur-xl shadow-2xl">
              <div class="relative aspect-square rounded-2xl overflow-hidden bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop"
                  alt="Aura Studio Headphones"
                  class="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />

                <!-- Floating Product Info Card -->
                <div class="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-between shadow-xl">
                  <div>
                    <span class="text-[10px] uppercase tracking-wider text-brand-300 font-bold">Featured Drop</span>
                    <h3 class="text-sm font-bold text-white font-heading truncate">Aura Studio ANC Headphones</h3>
                    <p class="text-xs text-slate-300 font-medium mt-0.5 font-heading">\$299 <span class="line-through text-slate-500 text-[11px]">\$349</span></p>
                  </div>

                  <a
                    [routerLink]="['/product', 'prod-1']"
                    class="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Pills / Visual Cards Section -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span class="text-xs font-bold text-brand-600 uppercase tracking-wider">Curated Collections</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-1">
              Explore by Category
            </h2>
          </div>
          <a routerLink="/shop" class="text-xs font-bold text-slate-700 hover:text-brand-600 flex items-center gap-1 transition-colors">
            <span>Browse All ({{ productService.products().length }})</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (cat of productService.categories(); track cat.id) {
            <a
              [routerLink]="['/shop']"
              [queryParams]="{ category: cat.name }"
              class="group relative h-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-end p-6"
            >
              <!-- Background Image with Gradient Overlay -->
              <img
                [src]="cat.image"
                [alt]="cat.name"
                class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent"></div>

              <!-- Content -->
              <div class="relative z-10 text-white">
                <span class="text-[11px] font-semibold text-brand-300 uppercase tracking-wider">
                  {{ cat.itemCount }} Items
                </span>
                <h3 class="text-lg font-bold font-heading mt-0.5 group-hover:text-brand-200 transition-colors">
                  {{ cat.name }}
                </h3>
                <p class="text-xs text-slate-300 mt-1 line-clamp-1">
                  {{ cat.description }}
                </p>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products Showcase with Interactive Tabs -->
    <section class="py-16 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <span class="text-xs font-bold text-brand-600 uppercase tracking-wider">Editor's Selections</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading mt-1">
              Trending Drops & Bestsellers
            </h2>
          </div>

          <!-- Filter Pills -->
          <div class="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            @for (tab of tabs; track tab.id) {
              <button
                (click)="activeTab.set(tab.id)"
                class="px-4 py-2 text-xs font-semibold rounded-xl transition-all"
                [ngClass]="activeTab() === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
              >
                {{ tab.label }}
              </button>
            }
          </div>
        </div>

        <!-- Products Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          @for (product of filteredProducts(); track product.id) {
            <app-product-card [product]="product" />
          }
        </div>

        <div class="mt-12 text-center">
          <a
            routerLink="/shop"
            class="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-2xl border border-slate-200 shadow-sm transition-all active:scale-95"
          >
            <span>View All Products in Catalog</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Promotional Banner Section -->
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-14 shadow-2xl">
          <!-- Ambient circles -->
          <div class="absolute -right-10 -bottom-10 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10 max-w-xl space-y-4">
            <span class="inline-block px-3 py-1 text-xs font-bold bg-brand-500 text-white rounded-full">
              LIMITED TIME OFFER
            </span>
            <h2 class="text-3xl sm:text-4xl font-extrabold font-heading">
              Elevate Your Workspace with 20% OFF Everything
            </h2>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Use promo code <span class="font-mono font-bold text-brand-300">WELCOME20</span> at checkout to claim instant 20% savings on all precision gear, apparel, and workspace essentials.
            </p>
            <div class="pt-2 flex flex-wrap gap-4">
              <button
                (click)="applyVoucher()"
                class="px-6 py-3 bg-white text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-slate-100 transition-all active:scale-95"
              >
                Claim Coupon (WELCOME20)
              </button>
              <a
                routerLink="/shop"
                class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-1"
              >
                <span>Shop the Sale</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomeComponent {
  productService = inject(ProductService);
  cartService = inject(CartService);

  tabs = [
    { id: 'all', label: 'All Picks' },
    { id: 'featured', label: 'Featured' },
    { id: 'bestseller', label: 'Bestsellers' },
    { id: 'new', label: 'New Arrivals' }
  ];

  activeTab = signal('all');

  filteredProducts = computed(() => {
    const list = this.productService.products();
    const tab = this.activeTab();

    if (tab === 'featured') {
      return list.filter(p => p.isFeatured || p.badge === 'Trending');
    }
    if (tab === 'bestseller') {
      return list.filter(p => p.badge === 'Bestseller' || p.rating >= 4.8);
    }
    if (tab === 'new') {
      return list.filter(p => p.badge === 'New Arrival' || p.badge === 'New');
    }
    return list.slice(0, 8);
  });

  applyVoucher(): void {
    this.cartService.applyPromoCode('WELCOME20');
  }
}
