import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/ecommerce.models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Fixed Top Header: Announcement Bar + Main Navbar permanently pinned at top of viewport -->
    <header class="fixed top-0 inset-x-0 z-40 w-full shadow-sm bg-white">
      <!-- Top Announcement Bar (Full Width) -->
      <div class="bg-slate-950 text-slate-300 text-[11px] font-medium py-2 px-4 sm:px-8 lg:px-12 w-full border-b border-slate-800/80">
        <div class="w-full flex items-center justify-between">
          <!-- Left: Perks -->
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span class="text-slate-200 font-semibold tracking-wide">Complimentary Express Shipping over \$100</span>
          </div>

          <!-- Center: Promo Voucher Banner -->
          <div class="hidden md:flex items-center gap-1.5 text-slate-300">
            <span>Spring Equinox Sale: Claim 20% OFF with code</span>
            <button
              (click)="copyCode('WELCOME20')"
              class="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 hover:bg-brand-500/30 font-mono font-bold tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer"
              title="Click to copy coupon code"
            >
              <span>WELCOME20</span>
              <svg class="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>

          <!-- Right: Support / Quick Info -->
          <div class="hidden lg:flex items-center gap-4 text-slate-400 text-[10px]">
            <a routerLink="/track" class="hover:text-white transition-colors">Track Shipment</a>
            <span>&bull;</span>
            <a routerLink="/account" class="hover:text-white transition-colors">Help Center</a>
          </div>
        </div>
      </div>

      <!-- Main Navigation Bar -->
      <div class="w-full bg-white border-b border-slate-200/80">
        <div class="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div class="flex items-center justify-between h-18 md:h-20 gap-4 lg:gap-8">
          
          <!-- Left: Mobile Menu Toggle & Brand Logo -->
          <div class="flex items-center gap-3 shrink-0">
            <button
              (click)="mobileMenuOpen.set(true)"
              class="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open mobile menu"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>

            <!-- Brand Logo -->
            <a routerLink="/" class="flex items-center gap-2.5 group shrink-0">
              <div class="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black tracking-tighter text-xl shadow-md group-hover:bg-brand-600 transition-colors">
                A
              </div>
              <div class="flex flex-col">
                <span class="text-xl md:text-2xl font-black tracking-tight text-slate-900 font-heading leading-tight">
                  AURA
                </span>
                <span class="text-[9px] tracking-widest uppercase font-bold text-slate-400 -mt-1">
                  Living &bull; Tech
                </span>
              </div>
            </a>
          </div>

          <!-- Center: Desktop Navigation Links (Spacious, No Line Wraps) -->
          <nav class="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold uppercase tracking-wider text-slate-600 whitespace-nowrap">
            <a
              routerLink="/"
              routerLinkActive="text-brand-600 font-bold"
              [routerLinkActiveOptions]="{ exact: true }"
              class="hover:text-brand-600 transition-colors py-1 relative"
            >
              Home
            </a>

            <a
              routerLink="/shop"
              routerLinkActive="text-brand-600 font-bold"
              class="hover:text-brand-600 transition-colors py-1 relative"
            >
              Shop All
            </a>

            <a
              routerLink="/shop"
              [queryParams]="{ category: 'Electronics' }"
              class="hover:text-brand-600 transition-colors py-1"
            >
              Electronics
            </a>

            <a
              routerLink="/shop"
              [queryParams]="{ category: 'Fashion & Apparel' }"
              class="hover:text-brand-600 transition-colors py-1"
            >
              Apparel
            </a>

            <a
              routerLink="/shop"
              [queryParams]="{ category: 'Home & Workspace' }"
              class="hover:text-brand-600 transition-colors py-1"
            >
              Workspace
            </a>

            <a
              routerLink="/track"
              routerLinkActive="text-brand-600 font-bold"
              class="hover:text-brand-600 transition-colors py-1 inline-flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
              </svg>
              <span>Track Order</span>
            </a>

            <a
              routerLink="/admin"
              routerLinkActive="text-brand-600 font-bold"
              class="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 text-slate-700 hover:text-brand-700 text-[11px] font-bold inline-flex items-center gap-1.5 transition-colors border border-slate-200/60"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
              <span>Admin Console</span>
            </a>
          </nav>

          <!-- Right: Search Bar, Actions & User Profile -->
          <div class="flex items-center gap-3 sm:gap-4 shrink-0">
            
            <!-- Live Search Bar -->
            <div class="relative hidden md:block w-48 lg:w-60 xl:w-72">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (input)="onSearchInput()"
                (focus)="searchFocused.set(true)"
                placeholder="Search catalog..."
                class="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-brand-500 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-slate-400 font-medium"
              />
              <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>

              <!-- Live Autocomplete Dropdown -->
              @if (searchFocused() && searchResults().length > 0) {
                <div
                  class="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-fade-in"
                >
                  <div class="p-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 px-3 bg-slate-50">
                    Matching Products ({{ searchResults().length }})
                  </div>
                  <div class="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    @for (res of searchResults(); track res.id) {
                      <div
                        (click)="selectSearchResult(res)"
                        class="p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <img [src]="res.image" [alt]="res.name" class="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0" />
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-bold text-slate-900 truncate">{{ res.name }}</p>
                          <p class="text-[10px] text-slate-500">{{ res.category }}</p>
                        </div>
                        <span class="text-xs font-bold text-slate-900 font-heading">\${{ res.price }}</span>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Mobile Search Icon Button -->
            <button
              (click)="toggleMobileSearch()"
              class="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Search"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>

            <!-- Wishlist Button with Live Count -->
            <a
              routerLink="/wishlist"
              class="relative p-2.5 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-slate-100 transition-colors"
              aria-label="Wishlist"
              title="Saved Wishlist"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
              @if (wishlistService.itemCount() > 0) {
                <span class="absolute 1 top-0.5 right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-scale-in shadow-xs">
                  {{ wishlistService.itemCount() }}
                </span>
              }
            </a>

            <!-- Cart Trigger Button with Live Count -->
            <button
              (click)="cartService.openDrawer()"
              class="relative p-2.5 rounded-xl text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Open cart drawer"
              title="Shopping Bag"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              @if (cartService.itemCount() > 0) {
                <span class="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center animate-scale-in shadow-xs">
                  {{ cartService.itemCount() }}
                </span>
              }
            </button>

            <!-- User Profile / Switch Role Menu (Compact & Crisp) -->
            <div class="relative">
              <button
                (click)="userMenuOpen.set(!userMenuOpen())"
                class="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all bg-white cursor-pointer"
              >
                <div class="hidden xl:flex items-center gap-1.5">
                  <span class="text-xs font-bold text-slate-800 whitespace-nowrap">{{ authService.user()?.name || 'Ashwin Kumar' }}</span>
                  <span
                    class="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                    [ngClass]="authService.isAdmin() ? 'bg-brand-100 text-brand-800' : 'bg-slate-100 text-slate-600'"
                  >
                    {{ authService.isAdmin() ? 'Admin' : 'VIP' }}
                  </span>
                </div>
                <img
                  [src]="authService.user()?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop'"
                  alt="User Avatar"
                  class="w-7 h-7 rounded-full object-cover border border-slate-200 shadow-xs"
                />
                <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <!-- User Dropdown with Glassmorphism -->
              @if (userMenuOpen()) {
                <div
                  class="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-fade-in"
                  (click)="userMenuOpen.set(false)"
                >
                  <div class="px-3 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-xl mb-1">
                    <p class="text-xs font-bold text-slate-900">{{ authService.user()?.name }}</p>
                    <p class="text-[11px] text-slate-500 truncate">{{ authService.user()?.email }}</p>
                    <div class="mt-1 flex items-center gap-1.5">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span class="text-[10px] font-semibold text-slate-600">
                        {{ authService.isAdmin() ? 'Administrator Mode' : 'Customer Account' }}
                      </span>
                    </div>
                  </div>

                  <div class="py-1 space-y-0.5">
                    <a
                      routerLink="/account"
                      class="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      <span>My Account & Orders</span>
                    </a>

                    <a
                      routerLink="/track"
                      class="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                      </svg>
                      <span>Track Shipment</span>
                    </a>

                    <a
                      routerLink="/wishlist"
                      class="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                      </svg>
                      <span>Saved Wishlist</span>
                    </a>

                    <a
                      routerLink="/admin"
                      class="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-brand-700 hover:bg-brand-50 rounded-xl transition-colors"
                    >
                      <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                      </svg>
                      <span>Admin Dashboard</span>
                    </a>
                  </div>

                  <div class="pt-1 mt-1 border-t border-slate-100">
                    <button
                      (click)="authService.toggleRole()"
                      class="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                    >
                      <span>Switch Role</span>
                      <span class="text-[10px] px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 font-bold">
                        {{ authService.isAdmin() ? 'To Customer' : 'To Admin' }}
                      </span>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Mobile search expandable input -->
        @if (mobileSearchOpen()) {
          <div class="md:hidden pb-3 pt-1 animate-slide-down">
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (input)="onSearchInput()"
                placeholder="Search products..."
                class="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        }
      </div>
    </div>
  </header>

  <!-- Spacer to preserve document layout beneath fixed header -->
  <div class="h-[105px] md:h-[113px] w-full pointer-events-none" aria-hidden="true"></div>

    <!-- Mobile Drawer Menu with Blur Backdrop -->
    @if (mobileMenuOpen()) {
      <div
        class="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-md transition-opacity"
        (click)="mobileMenuOpen.set(false)"
      ></div>

      <div class="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl p-6 flex flex-col justify-between animate-fade-in">
        <div class="space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">A</div>
              <div>
                <span class="font-extrabold text-lg font-heading block">AURA</span>
                <span class="text-[9px] uppercase tracking-wider text-slate-400 -mt-1 block">Living & Tech</span>
              </div>
            </div>
            <button (click)="mobileMenuOpen.set(false)" class="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <nav class="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            <a routerLink="/" (click)="mobileMenuOpen.set(false)" class="p-2.5 rounded-xl hover:bg-slate-100 transition-colors">Home</a>
            <a routerLink="/shop" (click)="mobileMenuOpen.set(false)" class="p-2.5 rounded-xl hover:bg-slate-100 transition-colors">Shop Catalog</a>
            <a routerLink="/shop" [queryParams]="{ category: 'Electronics' }" (click)="mobileMenuOpen.set(false)" class="p-2.5 rounded-xl hover:bg-slate-100 transition-colors">Electronics</a>
            <a routerLink="/shop" [queryParams]="{ category: 'Fashion & Apparel' }" (click)="mobileMenuOpen.set(false)" class="p-2.5 rounded-xl hover:bg-slate-100 transition-colors">Apparel</a>
            <a routerLink="/shop" [queryParams]="{ category: 'Home & Workspace' }" (click)="mobileMenuOpen.set(false)" class="p-2.5 rounded-xl hover:bg-slate-100 transition-colors">Workspace</a>
            <a routerLink="/wishlist" (click)="mobileMenuOpen.set(false)" class="p-2.5 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-between">
              <span>My Wishlist</span>
              <span class="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold">{{ wishlistService.itemCount() }}</span>
            </a>
            <a routerLink="/track" (click)="mobileMenuOpen.set(false)" class="p-2.5 rounded-xl hover:bg-slate-100 transition-colors">Track Shipment</a>
            <a routerLink="/account" (click)="mobileMenuOpen.set(false)" class="p-2.5 rounded-xl hover:bg-slate-100 transition-colors">My Account</a>
            <a routerLink="/admin" (click)="mobileMenuOpen.set(false)" class="p-2.5 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-between">
              <span>Admin Dashboard</span>
              <span class="w-2 h-2 rounded-full bg-brand-500"></span>
            </a>
          </nav>
        </div>

        <div class="pt-4 border-t border-slate-100 text-xs text-slate-600">
          <p class="font-bold text-slate-800">Support Concierge</p>
          <p class="mt-0.5 text-slate-500">concierge&#64;aurastore.com</p>
        </div>
      </div>
    }
  `
})
export class NavbarComponent {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);
  authService = inject(AuthService);
  productService = inject(ProductService);
  private router = inject(Router);

  searchQuery = '';
  searchFocused = signal(false);
  searchResults = signal<Product[]>([]);
  mobileMenuOpen = signal(false);
  mobileSearchOpen = signal(false);
  userMenuOpen = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.searchFocused.set(false);
      this.userMenuOpen.set(false);
    }
  }

  onSearchInput(): void {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.searchResults.set([]);
      return;
    }
    const matches = this.productService.products().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ).slice(0, 5);

    this.searchResults.set(matches);
  }

  selectSearchResult(product: Product): void {
    this.searchFocused.set(false);
    this.searchQuery = '';
    this.router.navigate(['/product', product.id]);
  }

  toggleMobileSearch(): void {
    this.mobileSearchOpen.update(v => !v);
  }

  copyCode(code: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    this.cartService.applyPromoCode(code);
  }
}
