import type {Snack as PrismaSnack, Vendor as PrismaVendor, Order as PrismaOrder, Review as PrismaReview, User as PrismaUser, OrderItem as PrismaOrderItem } from '@prisma/client';

export type Review = PrismaReview & {
    user: PrismaUser;
};

export type Snack = PrismaSnack & {
    reviews: Review[];
    vendor: PrismaVendor;
};

export type Vendor = PrismaVendor & {
  reviews: Review[];
  owner: PrismaUser;
};

export interface CartItem {
  snack: Snack;
  quantity: number;
}

export type OrderItem = PrismaOrderItem & {
    snack: Snack;
}

export type Order = PrismaOrder & {
    items: OrderItem[];
    user: PrismaUser;
};

export type User = PrismaUser & {
    orders: Order[];
    reviews: Review[];
    vendor?: Vendor | null;
}
