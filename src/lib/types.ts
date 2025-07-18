
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Snack {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  vendorId: string;
  category: string;
  reviews: Review[];
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  campusLocation: string;
  reviews: Review[];
  isApproved: boolean;
}

export interface CartItem {
  snack: Snack;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'Placed' | 'Preparing' | 'Ready for Pickup' | 'Completed' | 'Cancelled';
  orderDate: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'customer' | 'vendor' | 'admin';
  createdAt: string;
}
