"use client";

import { useState } from 'react';
import VendorCard from "@/components/shared/VendorCard";
import { vendors } from "@/lib/placeholder-data";
import { PaginationComponent } from '@/components/shared/PaginationComponent';

const ITEMS_PER_PAGE = 6;

export default function VendorsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
  const paginatedVendors = vendors.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

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
            {paginatedVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
            ))}
        </div>
        <div className="mt-12 flex justify-center">
             <PaginationComponent 
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
      </div>
    </div>
  );
}
