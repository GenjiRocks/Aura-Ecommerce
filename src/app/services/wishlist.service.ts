import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product } from '../models/ecommerce.models';
import { ToastService } from './toast.service';

const STORAGE_KEY_WISHLIST = 'aura_store_wishlist_v1';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  items = signal<Product[]>([]);

  itemCount = computed(() => this.items().length);

  constructor() {
    if (this.isBrowser) {
      const saved = localStorage.getItem(STORAGE_KEY_WISHLIST);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            this.items.set(parsed);
          }
        } catch (e) {
          console.error('Failed to parse wishlist', e);
        }
      }
    }
  }

  isWishlisted(productId: string): boolean {
    return this.items().some(p => p.id === productId);
  }

  toggle(product: Product): boolean {
    const exists = this.isWishlisted(product.id);
    let updated: Product[];

    if (exists) {
      updated = this.items().filter(p => p.id !== product.id);
      this.toast.show('Removed from Wishlist', `${product.name} removed from your wishlist.`, 'info');
    } else {
      updated = [...this.items(), product];
      this.toast.show('Saved to Wishlist', `${product.name} saved for later!`, 'success');
    }

    this.items.set(updated);
    this.save(updated);
    return !exists;
  }

  remove(productId: string): void {
    const updated = this.items().filter(p => p.id !== productId);
    this.items.set(updated);
    this.save(updated);
  }

  clear(): void {
    this.items.set([]);
    this.save([]);
  }

  private save(items: Product[]): void {
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(items));
    }
  }
}
