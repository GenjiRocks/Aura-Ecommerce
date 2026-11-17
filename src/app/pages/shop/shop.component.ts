import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../models/ecommerce.models';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="bg-slate-50 min-h-screen py-8 md:py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header Banner / Breadcrumb -->
        <div class="mb-8">
          <nav class="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <a routerLink="/" class="hover:text-slate-900 transition-colors">Home</a>
            <span>/</span>
            <span class="text-slate-900 font-semibold">Shop Catalog</span>
            @if (selectedCategory()) {
              <span>/</span>
              <span class="text-brand-600 font-semibold">{{ selectedCategory() }}</span>
            }
          </nav>
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 class="text-3xl font-extrabold text-slate-900 font-heading">Explore Catalog</h1>
              <p class="text-xs text-slate-500 mt-1">Discover {{ filteredProducts().length }} premium precision essentials</p>
            </div>

            <!-- Controls: Mobile Filter Button & View Mode -->
            <div class="flex items-center gap-3">
              <button
                (click)="mobileFilterOpen.set(true)"
                class="lg:hidden px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                <span>Filters ({{ activeFilterCount() }})</span>
              </button>

              <!-- Sort Dropdown -->
              <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-xs">
                <span class="text-slate-400 font-medium">Sort by:</span>
                <select
                  [ngModel]="sortBy()"
                  (ngModelChange)="sortBy.set($event)"
                  class="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Layout: Sidebar Filters + Products Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <!-- Desktop Sidebar Filters -->
          <div class="hidden lg:block lg:col-span-1 space-y-6">
            <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 sticky top-28">
              
              <!-- Search in catalog -->
              <div>
                <label class="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Search Products</label>
                <div class="relative">
                  <input
                    type="text"
                    [ngModel]="searchKeyword()"
                    (ngModelChange)="searchKeyword.set($event)"
                    placeholder="Keywords, model, feature..."
                    class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
              </div>

              <!-- Categories -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <label class="block text-xs font-bold text-slate-900 uppercase tracking-wider">Categories</label>
                  @if (selectedCategory()) {
                    <button (click)="selectedCategory.set('')" class="text-[11px] text-brand-600 font-semibold hover:underline">
                      Reset
                    </button>
                  }
                </div>
                <div class="space-y-1.5">
                  <button
                    (click)="selectedCategory.set('')"
                    class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                    [ngClass]="selectedCategory() === '' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'"
                  >
                    <span>All Products</span>
                    <span class="text-slate-400 text-[10px]">({{ productService.products().length }})</span>
                  </button>

                  @for (cat of productService.categories(); track cat.id) {
                    <button
                      (click)="selectedCategory.set(cat.name)"
                      class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                      [ngClass]="selectedCategory() === cat.name ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600 hover:bg-slate-50'"
                    >
                      <span>{{ cat.name }}</span>
                      <span class="text-slate-400 text-[10px]">({{ getCategoryCount(cat.name) }})</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Price Range Slider -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <label class="block text-xs font-bold text-slate-900 uppercase tracking-wider">Max Price</label>
                  <span class="text-xs font-bold text-brand-600 font-heading">\${{ maxPrice() }}</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="800"
                  step="10"
                  [ngModel]="maxPrice()"
                  (ngModelChange)="maxPrice.set($event)"
                  class="w-full accent-brand-600 cursor-pointer"
                />
                <div class="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                  <span>\$40</span>
                  <span>\$400</span>
                  <span>\$800</span>
                </div>
              </div>

              <!-- Minimum Rating -->
              <div>
                <label class="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">Customer Rating</label>
                <div class="space-y-1.5">
                  <label class="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input type="radio" name="minRating" [value]="0" [ngModel]="minRating()" (ngModelChange)="minRating.set($event)" class="accent-brand-600" />
                    <span>Any rating</span>
                  </label>
                  <label class="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input type="radio" name="minRating" [value]="4.5" [ngModel]="minRating()" (ngModelChange)="minRating.set($event)" class="accent-brand-600" />
                    <span class="flex items-center gap-1 font-semibold text-slate-800">
                      4.5★ & up
                    </span>
                  </label>
                  <label class="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                    <input type="radio" name="minRating" [value]="4.8" [ngModel]="minRating()" (ngModelChange)="minRating.set($event)" class="accent-brand-600" />
                    <span class="flex items-center gap-1 font-semibold text-slate-800">
                      4.8★ & up (Top Tier)
                    </span>
                  </label>
                </div>
              </div>

              <!-- Stock Availability Toggle -->
              <div class="pt-2 border-t border-slate-100">
                <label class="flex items-center justify-between text-xs font-semibold text-slate-800 cursor-pointer">
                  <span>In Stock Only</span>
                  <input
                    type="checkbox"
                    [ngModel]="inStockOnly()"
                    (ngModelChange)="inStockOnly.set($event)"
                    class="w-4 h-4 accent-brand-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              <!-- Clear Filters -->
              @if (activeFilterCount() > 0) {
                <button
                  (click)="resetFilters()"
                  class="w-full py-2.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                >
                  Clear All Filters ({{ activeFilterCount() }})
                </button>
              }
            </div>
          </div>

          <!-- Product Grid Area -->
          <div class="lg:col-span-3 space-y-6">
            
            <!-- Active Filter Chips -->
            @if (activeFilterCount() > 0) {
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs text-slate-400 font-medium">Applied:</span>

                @if (selectedCategory()) {
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-800 shadow-xs">
                    Category: {{ selectedCategory() }}
                    <button (click)="selectedCategory.set('')" class="text-slate-400 hover:text-slate-700">&times;</button>
                  </span>
                }

                @if (searchKeyword()) {
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-800 shadow-xs">
                    "{{ searchKeyword() }}"
                    <button (click)="searchKeyword.set('')" class="text-slate-400 hover:text-slate-700">&times;</button>
                  </span>
                }

                @if (maxPrice() < 800) {
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-800 shadow-xs">
                    Up to \${{ maxPrice() }}
                    <button (click)="maxPrice.set(800)" class="text-slate-400 hover:text-slate-700">&times;</button>
                  </span>
                }

                @if (minRating() > 0) {
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-800 shadow-xs">
                    Rating {{ minRating() }}★+
                    <button (click)="minRating.set(0)" class="text-slate-400 hover:text-slate-700">&times;</button>
                  </span>
                }

                @if (inStockOnly()) {
                  <span class="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-800 shadow-xs">
                    In Stock
                    <button (click)="inStockOnly.set(false)" class="text-slate-400 hover:text-slate-700">&times;</button>
                  </span>
                }

                <button
                  (click)="resetFilters()"
                  class="text-xs text-slate-500 hover:text-rose-600 underline font-medium ml-2"
                >
                  Reset All
                </button>
              </div>
            }

            <!-- Products Grid or Empty State -->
            @if (filteredProducts().length === 0) {
              <div class="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-lg mx-auto my-12">
                <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <h3 class="text-lg font-bold text-slate-900 font-heading">No matching products found</h3>
                <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  We couldn't find any items matching your selected criteria. Try adjusting your filters or price slider.
                </p>
                <button
                  (click)="resetFilters()"
                  class="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                @for (prod of filteredProducts(); track prod.id) {
                  <app-product-card [product]="prod" />
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filters Drawer with Mandatory Backdrop Blur -->
    @if (mobileFilterOpen()) {
      <div
        class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md transition-opacity"
        (click)="mobileFilterOpen.set(false)"
      ></div>

      <div class="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-fade-in">
        <div class="space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 class="text-base font-bold text-slate-900 font-heading">Filters</h3>
            <button (click)="mobileFilterOpen.set(false)" class="p-1 text-slate-400 hover:text-slate-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Category filter -->
          <div>
            <label class="block text-xs font-bold text-slate-900 mb-2">Category</label>
            <div class="space-y-1">
              <button
                (click)="selectedCategory.set('')"
                class="w-full text-left px-3 py-2 text-xs rounded-lg"
                [ngClass]="selectedCategory() === '' ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600'"
              >
                All Categories
              </button>
              @for (c of productService.categories(); track c.id) {
                <button
                  (click)="selectedCategory.set(c.name)"
                  class="w-full text-left px-3 py-2 text-xs rounded-lg"
                  [ngClass]="selectedCategory() === c.name ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-600'"
                >
                  {{ c.name }}
                </button>
              }
            </div>
          </div>

          <!-- Price filter -->
          <div>
            <label class="block text-xs font-bold text-slate-900 mb-2">Max Price: \${{ maxPrice() }}</label>
            <input
              type="range"
              min="40"
              max="800"
              step="10"
              [ngModel]="maxPrice()"
              (ngModelChange)="maxPrice.set($event)"
              class="w-full accent-brand-600"
            />
          </div>

          <!-- In stock -->
          <div>
            <label class="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>In Stock Only</span>
              <input type="checkbox" [ngModel]="inStockOnly()" (ngModelChange)="inStockOnly.set($event)" class="accent-brand-600 w-4 h-4" />
            </label>
          </div>
        </div>

        <div class="pt-6 border-t border-slate-100 flex gap-3">
          <button
            (click)="resetFilters()"
            class="flex-1 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl"
          >
            Reset
          </button>
          <button
            (click)="mobileFilterOpen.set(false)"
            class="flex-1 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-xl"
          >
            Show ({{ filteredProducts().length }})
          </button>
        </div>
      </div>
    }
  `
})
export class ShopComponent implements OnInit {
  productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  searchKeyword = signal<string>('');
  selectedCategory = signal<string>('');
  maxPrice = signal<number>(800);
  minRating = signal<number>(0);
  inStockOnly = signal<boolean>(false);
  sortBy = signal<string>('featured');
  mobileFilterOpen = signal(false);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      if (params['filter'] === 'bestseller') {
        this.sortBy.set('rating');
      }
      if (params['q']) {
        this.searchKeyword.set(params['q']);
      }
    });
  }

  getCategoryCount(categoryName: string): number {
    return this.productService.products().filter(p => p.category === categoryName).length;
  }

  activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedCategory()) count++;
    if (this.searchKeyword()) count++;
    if (this.maxPrice() < 800) count++;
    if (this.minRating() > 0) count++;
    if (this.inStockOnly()) count++;
    return count;
  });

  filteredProducts = computed(() => {
    let list = [...this.productService.products()];

    // Category filter
    const cat = this.selectedCategory();
    if (cat) {
      list = list.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    }

    // Search query
    const q = this.searchKeyword().trim().toLowerCase();
    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Max Price
    list = list.filter(p => p.price <= this.maxPrice());

    // Min Rating
    const minR = this.minRating();
    if (minR > 0) {
      list = list.filter(p => p.rating >= minR);
    }

    // In Stock Only
    if (this.inStockOnly()) {
      list = list.filter(p => p.inStock);
    }

    // Sort
    const sort = this.sortBy();
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => {
          const aNew = a.badge?.includes('New') ? 1 : 0;
          const bNew = b.badge?.includes('New') ? 1 : 0;
          if (aNew !== bNew) return bNew - aNew;
          return b.id.localeCompare(a.id);
        });
        break;
      default:
        // featured
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  });

  resetFilters(): void {
    this.searchKeyword.set('');
    this.selectedCategory.set('');
    this.maxPrice.set(800);
    this.minRating.set(0);
    this.inStockOnly.set(false);
    this.sortBy.set('featured');
  }
}
