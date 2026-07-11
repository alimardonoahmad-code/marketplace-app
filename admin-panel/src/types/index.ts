export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin' | 'courier';
  phone?: string;
  storeName?: string;
  storeAddress?: string;
  storeCity?: string;
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
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  seller?: User;
  category?: Category;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentReference?: string;
  shippingAddress: string;
  items: OrderItem[];
  user?: User;
  courier?: User;
  createdAt: string;
}
