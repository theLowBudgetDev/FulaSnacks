import Image from 'next/image';
import { notFound } from 'next/navigation';
import { vendors, allSnacks } from '@/lib/placeholder-data';
import SnackCard from '@/components/shared/SnackCard';
import { MapPin } from 'lucide-react';

export default function VendorDetailPage({ params }: { params: { id: string } }) {
  const vendor = vendors.find((v) => v.id === params.id);
  const snacks = allSnacks.filter((s) => s.vendorId === params.id);

  if (!vendor) {
    notFound();
  }

  return (
    <div>
      <section className="bg-card py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Image
              src={vendor.logoUrl}
              alt={`${vendor.name} logo`}
              width={150}
              height={150}
              className="rounded-full border-4 border-background shadow-lg"
              data-ai-hint="logo cooking"
            />
            <div className="text-center md:text-left">
              <h1 className="font-headline text-4xl font-bold md:text-5xl">{vendor.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground max-w-2xl">{vendor.description}</p>
              <div className="mt-4 flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>{vendor.campusLocation}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl font-bold text-center mb-12">
            Snacks from {vendor.name}
          </h2>
          {snacks.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {snacks.map((snack) => (
                <SnackCard key={snack.id} snack={snack} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">This vendor currently has no snacks available.</p>
          )}
        </div>
      </section>
    </div>
  );
}
