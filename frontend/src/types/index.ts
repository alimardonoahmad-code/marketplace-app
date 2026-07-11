export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin' | 'courier';
  phone?: string;
  avatar?: string;
  address?: string;
  storeName?: string;
  storeAddress?: string;
  storeCity?: string;
  storeDescription?: string;
  storeLatitude?: number | null;
  storeLongitude?: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface Store extends User {
  productCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  video?: string;
  status: string;
  rating: number;
  reviewCount: number;
  sellerId: string;
  categoryId?: string;
  seller?: User;
  category?: Category;
  createdAt: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  totalPrice: number;
  paymentMethod: 'online' | 'cod' | 'alif' | 'eskhata';
  paymentStatus: string;
  paymentPhone?: string;
  cardLast4?: string;
  paymentReference?: string;
  paymentProvider?: string;
  couponCode?: string;
  discountAmount?: number;
  shippingAddress: string;
  trackingNumber?: string;
  items: OrderItem[];
  user?: User;
  courier?: User;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  images: string[];
  user: User;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
