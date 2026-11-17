import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'AURA • Modern Lifestyle & Tech Store'
  },
  {
    path: 'shop',
    loadComponent: () => import('./pages/shop/shop.component').then(m => m.ShopComponent),
    title: 'Shop Catalog • AURA'
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Product Details • AURA'
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
    title: 'Saved Wishlist • AURA'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'Secure Checkout • AURA'
  },
  {
    path: 'track',
    loadComponent: () => import('./pages/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent),
    title: 'Track Order & Shipment • AURA'
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent),
    title: 'My Account & Orders • AURA'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    title: 'Admin Console • AURA'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
