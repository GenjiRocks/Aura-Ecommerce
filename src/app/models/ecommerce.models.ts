export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  inStock: boolean;
  stockQuantity: number;
  badge?: string;
  colors?: string[];
  sizes?: string[];
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  itemCount: number;
  image: string;
  description: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface TimelineEvent {
  status: string;
  time: string;
  completed: boolean;
  note: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  image: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  status: 'Pending' | 'Processing' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  courier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  timeline: TimelineEvent[];
}

export interface UserAddress {
  id: string;
  isDefault: boolean;
  tag: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface UserPaymentMethod {
  id: string;
  type: 'card' | 'upi';
  brand: string;
  last4?: string;
  holder?: string;
  expiry?: string;
  upiId?: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'customer' | 'admin';
  memberSince: string;
  tier: string;
  savedAddresses: UserAddress[];
  savedPaymentMethods: UserPaymentMethod[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
