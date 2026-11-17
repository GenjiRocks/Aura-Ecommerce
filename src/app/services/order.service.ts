import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Order, OrderItem, TimelineEvent } from '../models/ecommerce.models';
import { ToastService } from './toast.service';

const STORAGE_KEY_ORDERS = 'aura_store_orders_v1';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(true);

  constructor() {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);

    if (this.isBrowser) {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.orders.set(parsed);
            this.isLoading.set(false);
            return;
          }
        } catch (e) {
          console.error('Failed to parse cached orders', e);
        }
      }
    }

    this.http.get<Order[]>('/data/orders.json').subscribe({
      next: (data) => {
        this.orders.set(data);
        if (this.isBrowser) {
          localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(data));
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.warn('Could not load orders.json', err);
        this.isLoading.set(false);
      }
    });
  }

  getOrderById(id: string): Order | undefined {
    const cleanId = id.trim().toUpperCase();
    return this.orders().find(o => o.id.toUpperCase() === cleanId);
  }

  getOrderByTracking(tracking: string): Order | undefined {
    const clean = tracking.trim().toUpperCase();
    return this.orders().find(o => o.trackingNumber.toUpperCase() === clean || o.id.toUpperCase() === clean);
  }

  createOrder(data: {
    customer: { name: string; email: string; phone: string };
    shippingAddress: { street: string; city: string; state: string; zip: string; country: string };
    paymentMethod: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  }): Order {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `ORD-${randomSuffix}`;
    const trackingNum = `BD-${Math.floor(10000000 + Math.random() * 90000000)}IN`;

    const now = new Date();
    const dateStr = now.toISOString();
    const formattedTime = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const timeline: TimelineEvent[] = [
      {
        status: 'Order Placed',
        time: formattedTime,
        completed: true,
        note: `Payment verified via ${data.paymentMethod}`
      },
      {
        status: 'Processing & Packaging',
        time: 'In Progress',
        completed: false,
        note: 'Order routing to fulfillment center'
      },
      {
        status: 'Dispatched',
        time: 'Pending',
        completed: false,
        note: 'Courier pickup scheduled'
      },
      {
        status: 'In Transit',
        time: 'Pending',
        completed: false,
        note: 'Waybill generated'
      },
      {
        status: 'Out for Delivery',
        time: 'Pending',
        completed: false,
        note: 'Local delivery hub'
      },
      {
        status: 'Delivered',
        time: 'Est. 3-4 business days',
        completed: false,
        note: 'Handover & verification'
      }
    ];

    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 3);

    const newOrder: Order = {
      id: orderId,
      createdAt: dateStr,
      customer: data.customer,
      shippingAddress: data.shippingAddress,
      status: 'Processing',
      paymentMethod: data.paymentMethod,
      paymentStatus: 'Paid',
      courier: 'BlueDart Express Priority',
      trackingNumber: trackingNum,
      estimatedDelivery: estimatedDate.toISOString().split('T')[0],
      items: data.items,
      subtotal: data.subtotal,
      shipping: data.shipping,
      tax: data.tax,
      discount: data.discount,
      total: data.total,
      timeline
    };

    const updated = [newOrder, ...this.orders()];
    this.orders.set(updated);
    this.save(updated);

    return newOrder;
  }

  updateOrderStatus(orderId: string, newStatus: Order['status']): boolean {
    const list = this.orders();
    const index = list.findIndex(o => o.id === orderId);
    if (index === -1) return false;

    const order = { ...list[index] };
    order.status = newStatus;

    // Update timeline completed flags based on status progression
    const progression: Order['status'][] = [
      'Pending',
      'Processing',
      'Dispatched',
      'In Transit',
      'Out for Delivery',
      'Delivered'
    ];
    const currentIndex = progression.indexOf(newStatus);

    const nowFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
      new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    order.timeline = order.timeline.map((evt, idx) => {
      if (idx <= currentIndex) {
        return {
          ...evt,
          completed: true,
          time: evt.time === 'Pending' || evt.time === 'In Progress' ? nowFormatted : evt.time
        };
      }
      return evt;
    });

    const updated = [...list];
    updated[index] = order;

    this.orders.set(updated);
    this.save(updated);
    this.toast.show('Status Updated', `Order ${orderId} marked as ${newStatus}.`, 'success');
    return true;
  }

  private save(orders: Order[]): void {
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    }
  }
}
