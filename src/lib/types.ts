import type {Snack as PrismaSnack, Vendor as PrismaVendor, Order as PrismaOrder, Review as PrismaReview, User as PrismaUser, OrderItem as PrismaOrderItem } from '@prisma/client';

<<<<<<< HEAD
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
=======
import type { Prisma } from '@prisma/client';

export type User = Prisma.UserGetPayload<{}>;

export type Vendor = Prisma.VendorGetPayload<{
  include: {
    user: true;
    products: true;
  };
}>;
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c

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

export type CartItem = {
  snack: Snack;
  quantity: number;
<<<<<<< HEAD
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
=======
};
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
