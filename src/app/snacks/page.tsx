
"use client";

import { useState, useMemo, useEffect } from 'react';
import SnackCard from "@/components/shared/SnackCard";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { PaginationComponent } from '@/components/shared/PaginationComponent';
import type { Snack } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 8;

export default function AllSnacksPage() {
  const [allSnacks, setAllSnacks] = useState<Snack[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/snacks');
        const data = await res.json();
        setAllSnacks(data.snacks);
        setCategories(['all', ...data.categories]);
      } catch (error) {
        console.error("Failed to fetch snacks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const filteredSnacks = useMemo(() => allSnacks.filter(snack => {
    const matchesSearch = snack.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || snack.category === category;
    return matchesSearch && matchesCategory;
  }), [allSnacks, searchTerm, category]);

  const totalPages = Math.ceil(filteredSnacks.length / ITEMS_PER_PAGE);
  const paginatedSnacks = filteredSnacks.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
                All Snacks
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Browse through all our delicious snacks from various vendors.
            </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    type="search"
                    placeholder="Search for snacks..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                    }}
                />
            </div>
            <Select value={category} onValueChange={(value) => {
                setCategory(value);
                setCurrentPage(1); // Reset to first page on filter change
            }}
            disabled={loading}
            >
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
             {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
             ))}
           </div>
        ) : paginatedSnacks.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {paginatedSnacks.map((snack) => (
                    <SnackCard key={snack.id} snack={snack} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-2">No Snacks Found</h2>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
        )}
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
