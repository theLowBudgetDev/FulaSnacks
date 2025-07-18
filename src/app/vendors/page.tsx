<<<<<<< HEAD
import VendorCard from "@/components/shared/VendorCard";
import prisma from "@/lib/prisma";

export default async function VendorsPage() {
  const vendors = await prisma.vendor.findMany({
    where: { isApproved: true },
     include: {
        reviews: {
            include: {
                user: true,
            }
        },
        owner: true,
    }
  });
=======

import VendorCard from "@/components/shared/VendorCard";
import { PaginationComponent } from '@/components/shared/PaginationComponent';
import { prisma } from "@/lib/prisma";

const ITEMS_PER_PAGE = 6;

export default async function VendorsPage({ searchParams }: { searchParams: { page?: string }}) {
  const currentPage = Number(searchParams?.page) || 1;

  const vendorsCount = await prisma.vendor.count({
    where: { isApproved: true },
  });

  const vendors = await prisma.vendor.findMany({
    where: { isApproved: true },
    take: ITEMS_PER_PAGE,
    skip: (currentPage - 1) * ITEMS_PER_PAGE,
    orderBy: { user: { name: 'asc' } },
    include: {
        user: true,
        products: true,
    }
  });

  const totalPages = Math.ceil(vendorsCount / ITEMS_PER_PAGE);
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c

  return (
    <div className="bg-card">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
                All Campus Vendors
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Browse through our registered vendors and discover your next favorite snack.
            </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
            ))}
        </div>
<<<<<<< HEAD
=======
        <div className="mt-12 flex justify-center">
             <PaginationComponent 
                totalPages={totalPages}
                currentPage={currentPage}
            />
        </div>
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
      </div>
    </div>
  );
}
