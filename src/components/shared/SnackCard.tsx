"use client";

import Image from "next/image";
import Link from "next/link";
import type { Snack, Vendor } from "@/lib/types";
import { vendors } from "@/lib/placeholder-data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SnackCardProps {
  snack: Snack;
}

export default function SnackCard({ snack }: SnackCardProps) {
  const { toast } = useToast();
  const vendor = vendors.find((v) => v.id === snack.vendorId);

  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: `${snack.name} has been added to your cart.`,
    });
  };
  
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
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="font-headline text-lg mb-1">{snack.name}</CardTitle>
        <CardDescription className="text-sm">
          From{' '}
          <Link href={`/vendors/${vendor?.id}`} className="text-primary hover:underline">
            {vendor?.name}
          </Link>
        </CardDescription>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{snack.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-xl font-bold text-foreground">
          ₦{snack.price.toLocaleString()}
        </p>
        <Button size="sm" onClick={handleAddToCart} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
