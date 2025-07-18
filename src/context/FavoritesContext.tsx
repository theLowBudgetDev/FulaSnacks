
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface FavoritesContextType {
  favorites: string[]; // Array of snack IDs
  toggleFavorite: (snackId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from local storage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("snackFavorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("snackFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (snackId: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(snackId)) {
        return prevFavorites.filter((id) => id !== snackId);
      } else {
        return [...prevFavorites, snackId];
      }
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
