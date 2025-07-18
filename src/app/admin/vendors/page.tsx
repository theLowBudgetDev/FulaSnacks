
"use client";

import { useState } from 'react';
import { vendors as initialVendors } from "@/lib/placeholder-data";
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

const ITEMS_PER_PAGE = 10;

export default function AdminVendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();

    const totalPages = Math.ceil(vendors.length / ITEMS_PER_PAGE);
    const paginatedVendors = vendors.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleApprovalChange = (vendorId: string, isApproved: boolean) => {
        setVendors(vendors.map(v => v.id === vendorId ? {...v, isApproved } : v));
        const vendorName = vendors.find(v => v.id === vendorId)?.name;
        toast({
            title: `Vendor ${isApproved ? 'Approved' : 'Suspended'}`,
            description: `${vendorName} has been updated.`,
        });
    }

  return (
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
            {paginatedVendors.map(vendor => (
                <TableRow key={vendor.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={vendor.logoUrl} alt={vendor.name} />
                            <AvatarFallback>
                                <Store />
                            </AvatarFallback>
                        </Avatar>
                       <div>
                         {vendor.name}
                         <div className="text-sm text-muted-foreground">{vendor.id}</div>
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
                                    <DropdownMenuItem>View Dashboard</DropdownMenuItem>
                                    <DropdownMenuItem>View Products</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">Delete Vendor</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter>
        <PaginationComponent 
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
        />
      </CardFooter>
    </Card>
  );
}
