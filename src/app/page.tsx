
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SnackCard from "@/components/shared/SnackCard";
import VendorCard from "@/components/shared/VendorCard";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const featuredSnacks = await prisma.snack.findMany({
    take: 4,
    orderBy: {
      reviews: {
        _count: 'desc',
      },
    },
    include: {
      vendor: { include: { user: true } },
      reviews: { include: { user: true } },
    },
  });

  const vendors = await prisma.vendor.findMany({
    where: { isApproved: true },
    take: 3,
    orderBy: {
      user: {
        name: 'asc'
      }
    },
    include: {
      user: true,
      products: true,
      // Cannot include reviews directly on vendor, need to aggregate from snacks
    }
  });


  return (
    <div className="flex flex-col">
      <section className="bg-card py-20 md:py-32">
        <div className="container mx-auto px-4 text-left">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-6xl">
            FulaSnacks
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Your one-stop shop for the best snacks at Federal University Lafia. Quick, easy, and delicious.
          </p>
          <div className="mt-8 flex justify-start gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="#featured-snacks">
                Order Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/vendors">
                See Vendors
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="featured-snacks" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl font-bold text-center mb-12">
            Featured Snacks
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredSnacks.map((snack) => (
              <SnackCard key={snack.id} snack={snack} />
            ))}
          </div>
           <div className="text-center mt-12">
             <Button asChild variant="link" className="text-accent text-lg">
                <Link href="/snacks">
                  View all snacks <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
             </Button>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4">
        <hr className="border-border" />
      </div>

      <section id="vendors" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl font-bold text-center mb-12">
            Our Campus Vendors
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
          <div className="text-center mt-12">
             <Button asChild variant="link" className="text-accent text-lg">
                <Link href="/vendors">
                  View all vendors <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
             </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
