
"use client";

import type { CartItem, Snack } from "@/lib/types";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartContextType {
  cart: CartItem[];
  addToCart: (snack: Snack, quantity?: number) => void;
  removeFromCart: (snackId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (snack: Snack, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.snack.id === snack.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.snack.id === snack.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { snack, quantity }];
      }
    });
  };

  const removeFromCart = (snackId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.snack.id !== snackId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
