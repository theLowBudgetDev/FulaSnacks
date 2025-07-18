"use client";

import { useState } from 'react';
import SnackCard from "@/components/shared/SnackCard";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { allSnacks } from "@/lib/placeholder-data";
import { Search } from 'lucide-react';

export default function AllSnacksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(allSnacks.map(s => s.category)))];

  const filteredSnacks = allSnacks.filter(snack => {
    const matchesSearch = snack.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || snack.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-card">
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={category} onValueChange={setCategory}>
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

        {filteredSnacks.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {filteredSnacks.map((snack) => (
                    <SnackCard key={snack.id} snack={snack} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold mb-2">No Snacks Found</h2>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
        )}
      </div>
    </div>
  );
}
