
"use client";

import { useState, useMemo, useEffect } from 'react';
import SnackCard from "@/components/shared/SnackCard";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { PaginationComponent } from '@/components/shared/PaginationComponent';
<<<<<<< HEAD
import type { Snack } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
=======
import { Skeleton } from '@/components/ui/skeleton';
import type { Snack } from '@/lib/types';
import { useSearchParams, useRouter } from 'next/navigation';
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c

const ITEMS_PER_PAGE = 8;

export default function AllSnacksPage() {
<<<<<<< HEAD
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
=======
  const router = useRouter();
  const searchParams = useSearchParams();
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [totalSnacks, setTotalSnacks] = useState(0);
  const [loading, setLoading] = useState(true);

  const searchTerm = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchSnacksAndCategories = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          search: searchTerm,
          category: category,
          page: String(currentPage),
          limit: String(ITEMS_PER_PAGE),
        }).toString();
        
        // This is a placeholder for an API route you would create
        // For now, we'll simulate the API call with direct prisma access
        // In a real app, you would fetch from `/api/snacks?${query}`
        const res = await fetch(`/api/snacks?${query}`);
        const data = await res.json();
        
        setSnacks(data.snacks);
        setTotalSnacks(data.total);
        if (data.categories) {
            setCategories(['all', ...data.categories]);
        }
      } catch (error) {
        console.error("Failed to fetch snacks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSnacksAndCategories();
  }, [searchTerm, category, currentPage]);
  
  const totalPages = Math.ceil(totalSnacks / ITEMS_PER_PAGE);
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('search', e.target.value);
    params.set('page', '1');
    router.push(`/snacks?${params.toString()}`);
  }

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', value);
    params.set('page', '1');
    router.push(`/snacks?${params.toString()}`);
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    router.push(`/snacks?${params.toString()}`);
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
                    onChange={handleSearchChange}
                />
            </div>
<<<<<<< HEAD
            <Select value={category} onValueChange={(value) => {
                setCategory(value);
                setCurrentPage(1); // Reset to first page on filter change
            }}
            disabled={loading}
            >
=======
            <Select value={category} onValueChange={handleCategoryChange}>
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
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
<<<<<<< HEAD
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
=======
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <div key={i} className="space-y-3">
                        <Skeleton className="h-[170px] w-full rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        ) : snacks.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {snacks.map((snack) => (
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
