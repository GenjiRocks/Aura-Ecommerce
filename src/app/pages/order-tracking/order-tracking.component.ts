import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ToastService } from '../../services/toast.service';
import { Order } from '../../models/ecommerce.models';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-slate-50 min-h-screen py-10 md:py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Header -->
        <div class="text-center max-w-xl mx-auto mb-10">
          <span class="text-xs font-bold text-brand-600 uppercase tracking-wider">Live Logistics Tracking</span>
          <h1 class="text-3xl font-extrabold text-slate-900 font-heading mt-1">
            Track Your Shipment
          </h1>
          <p class="text-xs text-slate-500 mt-2">
            Enter your Order ID (e.g. ORD-94821) or Tracking Number (e.g. BD-88239041IN) for real-time status updates.
          </p>

          <!-- Search Input Form -->
          <form (submit)="searchOrder($event)" class="mt-6 flex gap-2 max-w-md mx-auto">
            <div class="relative flex-1">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                name="query"
                placeholder="Enter Order ID or Tracking Number"
                class="w-full pl-10 pr-4 py-3 text-xs bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 uppercase placeholder:normal-case shadow-xs"
                required
              />
              <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <button
              type="submit"
              class="px-6 py-3 bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all active:scale-95"
            >
              Track
            </button>
          </form>

          <!-- Quick Test Badges -->
          <div class="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] text-slate-600">
            <span>Try sample:</span>
            <button (click)="loadSample('ORD-94821')" class="underline text-brand-600 hover:text-brand-800 font-semibold font-mono">ORD-94821 (In Transit)</button>
            <span>&bull;</span>
            <button (click)="loadSample('ORD-93710')" class="underline text-brand-600 hover:text-brand-800 font-semibold font-mono">ORD-93710 (Delivered)</button>
          </div>
        </div>

        @if (selectedOrder(); as order) {
          <!-- Order Result Container -->
          <div class="bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-xl space-y-8 animate-scale-in">
            
            <!-- Top Summary Card -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-400 font-medium">Order:</span>
                  <span class="text-base font-bold text-slate-900 font-mono">{{ order.id }}</span>
                  <span
                    class="px-3 py-0.5 text-xs font-semibold rounded-full"
                    [ngClass]="{
                      'bg-sky-100 text-sky-800': order.status === 'In Transit' || order.status === 'Processing',
                      'bg-emerald-100 text-emerald-800': order.status === 'Delivered',
                      'bg-amber-100 text-amber-800': order.status === 'Pending' || order.status === 'Dispatched',
                      'bg-rose-100 text-rose-800': order.status === 'Cancelled'
                    }"
                  >
                    {{ order.status }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  Placed on {{ order.createdAt | date:'mediumDate' }} &bull; Carrier: {{ order.courier }}
                </p>
              </div>

              <!-- Tracking number copy box -->
              <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between sm:justify-start gap-3">
                <div>
                  <span class="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Tracking Code</span>
                  <span class="font-mono text-xs font-bold text-slate-800">{{ order.trackingNumber }}</span>
                </div>
                <button
                  (click)="copyTracking(order.trackingNumber)"
                  class="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                  aria-label="Copy tracking code"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Visual Tracking Timeline -->
            <div>
              <h3 class="text-base font-bold text-slate-900 font-heading mb-6">Delivery Progress</h3>
              
              <div class="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                @for (event of order.timeline; track event.status) {
                  <div class="relative flex items-start gap-4">
                    <!-- Dot Indicator -->
                    <div
                      class="absolute -left-[23px] sm:-left-[27px] mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all bg-white"
                      [ngClass]="event.completed
                        ? 'border-brand-600 text-brand-600 shadow-sm'
                        : 'border-slate-300 text-transparent'"
                    >
                      @if (event.completed) {
                        <span class="w-2.5 h-2.5 rounded-full bg-brand-600"></span>
                      }
                    </div>

                    <!-- Event Content -->
                    <div class="flex-1 min-w-0">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 class="text-xs font-bold" [ngClass]="event.completed ? 'text-slate-900' : 'text-slate-400'">
                          {{ event.status }}
                        </h4>
                        <span class="text-[11px]" [ngClass]="event.completed ? 'text-slate-500 font-medium' : 'text-slate-300'">
                          {{ event.time }}
                        </span>
                      </div>
                      <p class="text-xs mt-0.5" [ngClass]="event.completed ? 'text-slate-600' : 'text-slate-400'">
                        {{ event.note }}
                      </p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Shipping Address & Package Items Split Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              
              <!-- Address Details -->
              <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delivering To</span>
                <p class="text-xs font-bold text-slate-900">{{ order.customer.name }}</p>
                <p class="text-xs text-slate-600">{{ order.shippingAddress.street }}</p>
                <p class="text-xs text-slate-600">
                  {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zip }}
                </p>
                <p class="text-xs text-slate-500 pt-1 font-mono">{{ order.customer.phone }}</p>
              </div>

              <!-- Package Items -->
              <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Package Items</span>
                @for (item of order.items; track item.id) {
                  <div class="flex items-center gap-3">
                    <img [src]="item.image" [alt]="item.name" class="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200 shrink-0" />
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-semibold text-slate-900 truncate">{{ item.name }}</p>
                      <p class="text-[11px] text-slate-500">Qty: {{ item.quantity }} &bull; \${{ item.price }}</p>
                    </div>
                    <span class="text-xs font-bold text-slate-900">\${{ item.price * item.quantity }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Footer summary -->
            <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <span class="text-slate-500">Payment: {{ order.paymentMethod }} &bull; Total Paid: <strong class="text-slate-900 font-heading">\${{ order.total }}</strong></span>
              
              <button
                (click)="simulateInvoiceDownload(order.id)"
                class="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>Download Invoice PDF</span>
              </button>
            </div>
          </div>
        } @else if (searched() && !selectedOrder()) {
          <div class="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm max-w-md mx-auto">
            <h3 class="text-base font-bold text-slate-900 font-heading">No Shipment Found</h3>
            <p class="text-xs text-slate-500 mt-1">
              We couldn't locate any order matching "{{ searchQuery }}". Please check your tracking number and try again.
            </p>
          </div>
        }
      </div>
    </div>
  `
})
export class OrderTrackingComponent implements OnInit {
  orderService = inject(OrderService);
  toastService = inject(ToastService);
  private route = inject(ActivatedRoute);

  searchQuery = '';
  selectedOrder = signal<Order | null>(null);
  searched = signal(false);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tracking = params['tracking'] || params['orderId'];
      if (tracking) {
        this.searchQuery = tracking;
        this.lookup(tracking);
      } else {
        // Load latest order by default
        const list = this.orderService.orders();
        if (list.length > 0) {
          this.selectedOrder.set(list[0]);
        }
      }
    });
  }

  searchOrder(e: Event): void {
    e.preventDefault();
    if (!this.searchQuery.trim()) return;
    this.lookup(this.searchQuery);
  }

  loadSample(code: string): void {
    this.searchQuery = code;
    this.lookup(code);
  }

  private lookup(term: string): void {
    this.searched.set(true);
    const found = this.orderService.getOrderByTracking(term) || this.orderService.getOrderById(term);
    this.selectedOrder.set(found || null);
  }

  copyTracking(code: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    this.toastService.show('Copied!', `Tracking number ${code} copied to clipboard.`, 'info');
  }

  simulateInvoiceDownload(orderId: string): void {
    this.toastService.show(
      'Invoice Ready',
      `Downloading tax invoice for ${orderId}...`,
      'success'
    );
  }
}
