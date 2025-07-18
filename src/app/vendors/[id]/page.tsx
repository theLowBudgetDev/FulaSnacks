import Image from 'next/image';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SnackCard from '@/components/shared/SnackCard';
import { MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

export default async function VendorDetailPage({ params }: { params: { id: string } }) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: params.id, isApproved: true },
    include: {
      user: true,
      products: {
        include: {
          vendor: { include: { user: true } },
          reviews: { include: { user: true } },
        }
      },
    },
  });

  if (!vendor) {
    notFound();
  }

  const reviews = await prisma.review.findMany({
    where: { snack: { vendorId: vendor.id } },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div>
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Image
              src={vendor.logoUrl || 'https://placehold.co/150x150.png'}
              alt={`${vendor.user.name} logo`}
              width={150}
              height={150}
              className="rounded-full border-4 border-background shadow-lg"
              data-ai-hint="logo cooking"
            />
            <div className="text-center md:text-left">
              <h1 className="font-headline text-4xl font-bold md:text-5xl">{vendor.user.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground max-w-2xl">{vendor.description}</p>
              <div className="mt-4 flex items-center justify-center md:justify-start gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{vendor.campusLocation}</span>
                </div>
                {reviews.length > 0 && (
                 <>
                    <Separator orientation="vertical" className="h-5"/>
                    <div className="flex items-center gap-1.5 text-amber-500 font-medium">
                        <Star className="h-5 w-5 fill-current" />
                        <span>{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
                    </div>
                 </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-3">
                <h2 className="font-headline text-3xl font-bold mb-8">
                    Snacks from {vendor.user.name}
                </h2>
                {vendor.products.length > 0 ? (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {vendor.products.map((snack) => (
                        <SnackCard key={snack.id} snack={snack} />
                    ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">This vendor currently has no snacks available.</p>
                )}
            </div>
            <div className="md:col-span-1">
                 <h2 className="font-headline text-3xl font-bold mb-8">
                    Reviews
                </h2>
                {reviews.length > 0 ? (
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            {reviews.map(review => (
                                <div key={review.id}>
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold">{review.user.name}</p>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">{format(new Date(review.createdAt), "PPP")}</p>
                                    <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ) : (
                     <p className="text-muted-foreground">No reviews for this vendor yet.</p>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
