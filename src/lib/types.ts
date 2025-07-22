
import type { Prisma } from '@prisma/client';

export type User = Prisma.UserGetPayload<{}>;

export type Vendor = Prisma.VendorGetPayload<{
  include: {
    user: true;
    products: true;
  };
}>;

export type Snack = Prisma.SnackGetPayload<{
  include: {
    vendor: { include: { user: true } };
    reviews: { include: { user: true } };
  };
}>;

export type Review = Prisma.ReviewGetPayload<{
  include: {
    user: true;
  };
}>;

export type Order = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        snack: true;
      };
    };
    user: true;
  };
}>;

export type OrderItem = Prisma.OrderItemGetPayload<{
  include: {
    snack: true,
    order: true
  }
}>

export type CartItem = {
  snack: Snack;
  quantity: number;
};
