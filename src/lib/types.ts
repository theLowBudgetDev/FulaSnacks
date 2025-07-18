export interface Snack {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  vendorId: string;
  category: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  campusLocation: string;
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
}
