import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product, Category } from '../models/ecommerce.models';

const STORAGE_KEY_PRODUCTS = 'aura_store_products_v4';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal<boolean>(true);

  // Quick view modal signal
  quickViewProduct = signal<Product | null>(null);

  constructor() {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading.set(true);

    // Try loading from localStorage if in browser
    if (this.isBrowser) {
      // Clean up legacy caches with old broken urls if present
      localStorage.removeItem('aura_store_products_v1');
      localStorage.removeItem('aura_store_products_v2');
      localStorage.removeItem('aura_store_products_v3');

      const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Ensure no legacy broken URLs
            const sanitized = parsed.map(p => {
              if (p.image?.includes('photo-1622445262464')) {
                return {
                  ...p,
                  image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80&auto=format&fit=crop',
                  images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80&auto=format&fit=crop']
                };
              }
              if (p.image?.includes('photo-1580481077195')) {
                return {
                  ...p,
                  image: 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=800&q=80&auto=format&fit=crop',
                  images: ['https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=800&q=80&auto=format&fit=crop']
                };
              }
              return p;
            });
            this.products.set(sanitized);
            this.loadCategories();
            this.isLoading.set(false);
            return;
          }
        } catch (e) {
          console.error('Failed to parse cached products', e);
        }
      }
    }

    // Otherwise load from public data json
    this.http.get<Product[]>('/data/products.json').subscribe({
      next: (data) => {
        this.products.set(data);
        if (this.isBrowser) {
          localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(data));
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.warn('Could not fetch products.json, using fallback data', err);
        this.isLoading.set(false);
      }
    });

    this.loadCategories();
  }

  private loadCategories(): void {
    this.http.get<Category[]>('/data/categories.json').subscribe({
      next: (cats) => {
        this.categories.set(cats);
      },
      error: (err) => {
        console.warn('Could not fetch categories.json', err);
      }
    });
  }

  getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products().find(p => p.slug === slug || p.id === slug);
  }

  openQuickView(product: Product): void {
    this.quickViewProduct.set(product);
  }

  closeQuickView(): void {
    this.quickViewProduct.set(null);
  }

  // Admin mutations
  addProduct(newProd: Omit<Product, 'id'>): Product {
    const id = 'prod-' + Date.now();
    const product: Product = {
      ...newProd,
      id,
      slug: newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      reviewsCount: newProd.reviewsCount || 0,
      rating: newProd.rating || 5.0,
      images: newProd.images?.length ? newProd.images : [newProd.image]
    };

    const updated = [product, ...this.products()];
    this.products.set(updated);
    this.persist(updated);
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): boolean {
    const list = this.products();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return false;

    const updatedProduct = { ...list[index], ...updates };
    const updated = [...list];
    updated[index] = updatedProduct;

    this.products.set(updated);
    this.persist(updated);
    return true;
  }

  deleteProduct(id: string): boolean {
    const filtered = this.products().filter(p => p.id !== id);
    if (filtered.length === this.products().length) return false;

    this.products.set(filtered);
    this.persist(filtered);
    return true;
  }

  resetToDefaults(): void {
    this.http.get<Product[]>('/data/products.json').subscribe(data => {
      this.products.set(data);
      if (this.isBrowser) {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(data));
      }
    });
  }

  private persist(products: Product[]): void {
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    }
  }
}
