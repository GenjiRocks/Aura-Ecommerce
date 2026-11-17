import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserProfile, UserAddress } from '../models/ecommerce.models';
import { ToastService } from './toast.service';

const STORAGE_KEY_USER = 'aura_store_user_v1';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  user = signal<UserProfile | null>(null);
  isAdmin = computed(() => this.user()?.role === 'admin');

  constructor() {
    this.loadUser();
  }

  loadUser(): void {
    if (this.isBrowser) {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) {
            this.user.set(parsed);
            return;
          }
        } catch (e) {
          console.error('Failed to load user', e);
        }
      }
    }

    this.http.get<UserProfile>('/data/user.json').subscribe({
      next: (userData) => {
        this.user.set(userData);
        if (this.isBrowser) {
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
        }
      },
      error: (err) => {
        console.warn('Could not load user.json, using fallback', err);
        const fallback: UserProfile = {
          id: 'usr-8821',
          name: 'Ashwin',



          email: 'ashwin@example.com',
          phone: '+91 98765 43210',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop',
          role: 'customer',
          memberSince: 'March 2024',
          tier: 'Aura Black VIP',
          savedAddresses: [],
          savedPaymentMethods: []
        };
        this.user.set(fallback);
      }
    });
  }

  toggleRole(): void {
    const current = this.user();
    if (!current) return;

    const newRole = current.role === 'admin' ? 'customer' : 'admin';
    const updated = { ...current, role: newRole as 'admin' | 'customer' };
    this.user.set(updated);
    this.save(updated);

    this.toast.show(
      'Role Switched',
      `Switched view to ${newRole === 'admin' ? 'Store Administrator' : 'Customer Account'}.`,
      'info'
    );
  }

  addAddress(address: Omit<UserAddress, 'id'>): void {
    const current = this.user();
    if (!current) return;

    const id = 'addr-' + Date.now();
    const newAddress: UserAddress = { ...address, id };

    let addresses = [...current.savedAddresses];
    if (newAddress.isDefault) {
      addresses = addresses.map(a => ({ ...a, isDefault: false }));
    }
    addresses.push(newAddress);

    const updated = { ...current, savedAddresses: addresses };
    this.user.set(updated);
    this.save(updated);
    this.toast.show('Address Saved', 'New delivery address has been added.', 'success');
  }

  setDefaultAddress(addressId: string): void {
    const current = this.user();
    if (!current) return;

    const addresses = current.savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === addressId
    }));

    const updated = { ...current, savedAddresses: addresses };
    this.user.set(updated);
    this.save(updated);
    this.toast.show('Default Updated', 'Default shipping address updated.', 'success');
  }

  deleteAddress(addressId: string): void {
    const current = this.user();
    if (!current) return;

    const addresses = current.savedAddresses.filter(a => a.id !== addressId);
    const updated = { ...current, savedAddresses: addresses };
    this.user.set(updated);
    this.save(updated);
    this.toast.show('Address Removed', 'Delivery address removed.', 'info');
  }

  private save(user: UserProfile): void {
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }
  }
}
