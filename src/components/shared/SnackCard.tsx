
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Snack } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Heart, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { cn } from "@/lib/utils";

interface SnackCardProps {
  snack: Snack;
}

export default function SnackCard({ snack }: SnackCardProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const vendor = snack.vendor;
  const isFavorite = favorites.includes(snack.id);

  const handleAddToCart = () => {
    addToCart(snack);
    toast({
      title: "Added to cart!",
      description: `${snack.name} has been added to your cart.`,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(snack.id);
     toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${snack.name} has been ${isFavorite ? 'removed from' : 'added to'} your favorites.`,
    });
  }
  
  const averageRating = snack.reviews.length > 0 ? snack.reviews.reduce((acc, review) => acc + review.rating, 0) / snack.reviews.length : 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={snack.imageUrl}
            alt={snack.name}
            fill
            className="object-cover"
            data-ai-hint="snack food"
          />
           <Button 
              size="icon" 
              variant="secondary"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={handleToggleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFavorite ? "text-red-500 fill-current" : "text-muted-foreground")} />
              <span className="sr-only">Favorite</span>
           </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start">
            <CardTitle className="font-headline text-lg mb-1">{snack.name}</CardTitle>
            {snack.reviews.length > 0 && (
                <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{averageRating.toFixed(1)}</span>
                </div>
            )}
        </div>
        <CardDescription className="text-sm">
          From{' '}
          <Link href={`/vendors/${vendor?.id}`} className="text-primary hover:underline">
            {vendor?.user.name}
          </Link>
        </CardDescription>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{snack.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-xl font-bold text-accent">
          ₦{snack.price.toLocaleString()}
        </p>
        <Button size="sm" onClick={handleAddToCart}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
