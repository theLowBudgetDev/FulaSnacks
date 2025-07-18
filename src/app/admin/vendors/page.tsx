
"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import type { Vendor } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { PaginationComponent } from '@/components/shared/PaginationComponent';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Store } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { DeleteVendorDialog } from '@/components/admin/DeleteVendorDialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

export default function AdminVendorsPage() {
    const router = useRouter();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [totalVendors, setTotalVendors] = useState(0);
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { toast } = useToast();
    
    useEffect(() => {
        // Fetch vendors from API
    }, []);

    useEffect(() => {
        const fetchVendors = async () => {
            setLoading(true);
            const params = new URLSearchParams({
                page: String(currentPage),
                limit: String(ITEMS_PER_PAGE),
            });
            // const res = await fetch(`/api/admin/vendors?${params.toString()}`);
            // const data = await res.json();
            // setVendors(data.vendors);
            // setTotalVendors(data.total);
            setLoading(false);
        };
        fetchVendors();
    }, [currentPage]);
    
    const totalPages = Math.ceil(totalVendors / ITEMS_PER_PAGE);

    const handleApprovalChange = async (vendorId: string, isApproved: boolean) => {
        // API call to update vendor approval
        // await fetch(`/api/admin/vendors/${vendorId}`, { method: 'PUT', body: JSON.stringify({ isApproved }) });
        
        setVendors(vendors.map(v => v.id === vendorId ? {...v, isApproved } : v));
        const vendorName = vendors.find(v => v.id === vendorId)?.user.name;
        toast({
            title: `Vendor ${isApproved ? 'Approved' : 'Suspended'}`,
            description: `${vendorName} has been updated.`,
        });
    };

    const handleDeleteVendor = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setIsDeleteDialogOpen(true);
    };

    const confirmDeleteVendor = async () => {
        if(selectedVendor) {
            // await fetch(`/api/admin/vendors/${selectedVendor.id}`, { method: 'DELETE' });
            setVendors(vendors.filter(v => v.id !== selectedVendor.id));
             toast({
                title: "Vendor Deleted",
                description: `${selectedVendor.user.name} has been removed.`,
            });
        }
        setIsDeleteDialogOpen(false);
        setSelectedVendor(null);
    }

  return (
      <>
    <Card>
        <CardHeader>
            <CardTitle>Vendor Management</CardTitle>
            <CardDescription>Approve, view, and manage all vendors on the platform.</CardDescription>
        </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={4}><Skeleton className="h-12 w-full" /></TableCell>
                    </TableRow>
                ))
            ) : vendors.map(vendor => (
                <TableRow key={vendor.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={vendor.logoUrl || ''} alt={vendor.user.name} />
                            <AvatarFallback>
                                <Store />
                            </AvatarFallback>
                        </Avatar>
                       <div>
                         {vendor.user.name}
                         <div className="text-sm text-muted-foreground">{vendor.user.email}</div>
                       </div>
                    </TableCell>
                    <TableCell>{vendor.campusLocation}</TableCell>
                    <TableCell>
                        <Badge variant={vendor.isApproved ? 'default' : 'destructive'}>
                            {vendor.isApproved ? 'Approved' : 'Suspended'}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                            <Switch 
                                checked={vendor.isApproved}
                                onCheckedChange={(checked) => handleApprovalChange(vendor.id, checked)}
                                aria-label="Toggle vendor approval"
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/vendors/${vendor.id}`}>View Storefront</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteVendor(vendor)}>Delete Vendor</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
             {vendors.length === 0 && !loading && (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No vendors found.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter>
        <PaginationComponent 
            totalPages={totalPages}
            currentPage={currentPage}
        />
      </CardFooter>
    </Card>
    <DeleteVendorDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteVendor}
        vendorName={selectedVendor?.user.name}
    />
    </>
  );
}
