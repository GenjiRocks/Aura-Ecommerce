import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Product, CartItem } from '../models/ecommerce.models';
import { ToastService } from './toast.service';

const STORAGE_KEY_CART = 'aura_store_cart_v1';
const FREE_SHIPPING_MIN = 100;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  items = signal<CartItem[]>([]);
  isOpen = signal<boolean>(false);
  promoCode = signal<string>('');
  discountRate = signal<number>(0); // e.g. 0.1 for 10%

  freeShippingThreshold = FREE_SHIPPING_MIN;

  itemCount = computed(() => {
    return this.items().reduce((acc, item) => acc + item.quantity, 0);
  });

  subtotal = computed(() => {
    return this.items().reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  });

  discountAmount = computed(() => {
    return +(this.subtotal() * this.discountRate()).toFixed(2);
  });

  shipping = computed(() => {
    if (this.subtotal() === 0 || this.subtotal() >= FREE_SHIPPING_MIN) return 0;
    return 12;
  });

  tax = computed(() => {
    const taxable = Math.max(0, this.subtotal() - this.discountAmount());
    return +(taxable * 0.08).toFixed(2);
  });

  total = computed(() => {
    const discounted = Math.max(0, this.subtotal() - this.discountAmount());
    return +(discounted + this.shipping() + this.tax()).toFixed(2);
  });

  freeShippingRemaining = computed(() => {
    return Math.max(0, +(FREE_SHIPPING_MIN - this.subtotal()).toFixed(2));
  });

  freeShippingProgress = computed(() => {
    if (this.subtotal() >= FREE_SHIPPING_MIN) return 100;
    return Math.min(100, Math.round((this.subtotal() / FREE_SHIPPING_MIN) * 100));
  });

  constructor() {
    if (this.isBrowser) {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            this.items.set(parsed);
          }
        } catch (e) {
          console.error('Failed to load cart', e);
        }
      }
    }
  }

  addToCart(product: Product, quantity = 1, selectedColor?: string, selectedSize?: string): void {
    const current = this.items();
    const colorToUse = selectedColor || (product.colors && product.colors[0]) || undefined;
    const sizeToUse = selectedSize || (product.sizes && product.sizes[0]) || undefined;

    const existingIndex = current.findIndex(
      item => item.product.id === product.id &&
              item.selectedColor === colorToUse &&
              item.selectedSize === sizeToUse
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity
      };
    } else {
      updated = [...current, { product, quantity, selectedColor: colorToUse, selectedSize: sizeToUse }];
    }

    this.items.set(updated);
    this.saveCart(updated);

    this.toast.show(
      'Added to Cart',
      `${quantity}x ${product.name} added to your shopping bag.`,
      'success'
    );
  }

  updateQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(index);
      return;
    }

    const current = [...this.items()];
    if (current[index]) {
      current[index] = { ...current[index], quantity };
      this.items.set(current);
      this.saveCart(current);
    }
  }

  removeItem(index: number): void {
    const current = [...this.items()];
    const removed = current.splice(index, 1)[0];
    this.items.set(current);
    this.saveCart(current);

    if (removed) {
      this.toast.show('Removed', `${removed.product.name} was removed from your bag.`, 'info');
    }
  }

  clearCart(): void {
    this.items.set([]);
    this.promoCode.set('');
    this.discountRate.set(0);
    this.saveCart([]);
  }

  applyPromoCode(code: string): { success: boolean; message: string } {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      return { success: false, message: 'Please enter a valid discount code' };
    }

    if (normalized === 'AURA10' || normalized === 'SAVE10') {
      this.promoCode.set(normalized);
      this.discountRate.set(0.10);
      this.toast.show('Promo Applied!', '10% discount applied to your order.', 'success');
      return { success: true, message: '10% OFF coupon applied successfully!' };
    } else if (normalized === 'WELCOME20' || normalized === 'EQUINOX20') {
      this.promoCode.set(normalized);
      this.discountRate.set(0.20);
      this.toast.show('VIP Discount Applied!', '20% exclusive discount applied!', 'success');
      return { success: true, message: '20% OFF VIP voucher applied!' };
    } else {
      this.toast.show('Invalid Code', 'Coupon code is invalid or expired. Try "WELCOME20"', 'error');
      return { success: false, message: 'Invalid or expired code. Try WELCOME20' };
    }
  }

  removePromoCode(): void {
    this.promoCode.set('');
    this.discountRate.set(0);
    this.toast.show('Coupon Removed', 'Discount coupon removed from order.', 'info');
  }

  openDrawer(): void {
    this.isOpen.set(true);
  }

  closeDrawer(): void {
    this.isOpen.set(false);
  }

  toggleDrawer(): void {
    this.isOpen.update(v => !v);
  }

  private saveCart(items: CartItem[]): void {
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
    }
  }
}
