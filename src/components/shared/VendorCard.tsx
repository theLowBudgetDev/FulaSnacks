
import Image from "next/image";
import Link from "next/link";
import type { Vendor } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowRight, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

interface VendorCardProps {
  vendor: Vendor;
}

<<<<<<< HEAD
export default function VendorCard({ vendor }: VendorCardProps) {
  const averageRating = vendor.reviews.length > 0 ? vendor.reviews.reduce((acc, review) => acc + review.rating, 0) / vendor.reviews.length : 0;
=======
export default async function VendorCard({ vendor }: VendorCardProps) {
  // Since reviews are on snacks, we need to aggregate them.
  const reviews = await prisma.review.findMany({
    where: {
      snack: {
        vendorId: vendor.id,
      },
    },
  });

  const averageRating = reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0;
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
  
  return (
    <Link href={`/vendors/${vendor.id}`}>
      <Card className="group flex flex-col h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary">
        <CardHeader className="flex flex-row items-start gap-4">
          <Image
            src={vendor.logoUrl || 'https://placehold.co/100x100.png'}
            alt={`${vendor.user.name} logo`}
            width={64}
            height={64}
            className="rounded-full border"
            data-ai-hint="logo food"
          />
          <div className="flex-1">
            <CardTitle className="font-headline text-xl">{vendor.user.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4" />
              {vendor.campusLocation}
            </CardDescription>
          </div>
           {reviews.length > 0 && (
                <div className="flex items-center gap-1 text-sm font-medium text-amber-500 shrink-0">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{averageRating.toFixed(1)} ({reviews.length})</span>
                </div>
            )}
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {vendor.description}
          </p>
        </CardContent>
        <div className="p-6 pt-0">
            <div className="flex items-center justify-end text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
              View Menu <ArrowRight className="ml-2 h-4 w-4" />
            </div>
        </div>
      </Card>
    </Link>
  );
}
