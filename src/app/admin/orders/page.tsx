
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText } from 'lucide-react';
import type { Order } from '@/lib/types';
import { PaginationComponent } from '@/components/shared/PaginationComponent';
import { OrderDetailDialog } from '@/components/shared/OrderDetailDialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

export default function AdminOrdersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [loading, setLoading] = useState(true);

    const searchTerm = searchParams.get('search') || '';
    const statusFilter = searchParams.get('status') || 'all';
    const currentPage = Number(searchParams.get('page') || '1');
    
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const params = new URLSearchParams({
                search: searchTerm,
                status: statusFilter,
                page: String(currentPage),
                limit: String(ITEMS_PER_PAGE),
            });
            const res = await fetch(`/api/admin/orders?${params.toString()}`);
            const data = await res.json();
            setOrders(data.orders);
            setTotalOrders(data.total);
            setLoading(false);
        };
        fetchOrders();
    }, [searchTerm, statusFilter, currentPage]);

    const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('search', term);
        params.set('page', '1');
        router.push(`/admin/orders?${params.toString()}`);
    }

    const handleFilter = (status: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('status', status);
        params.set('page', '1');
        router.push(`/admin/orders?${params.toString()}`);
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
          case 'Preparing': return 'secondary';
          case 'Ready for Pickup': return 'default';
          case 'Completed': return 'outline';
          case 'Cancelled': return 'destructive';
          default: return 'outline';
        }
    };
    
  return (
    <>
    <Card>
        <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>Search, filter, and view all orders on the platform.</CardDescription>
        </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    type="search"
                    placeholder="Search by Order ID or User ID..."
                    className="pl-10"
                    defaultValue={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>
            <Select value={statusFilter} onValueChange={handleFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Preparing">Preparing</SelectItem>
                    <SelectItem value="Ready for Pickup">Ready for Pickup</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                ))
            ) : orders.map(order => (
                <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0,8)}...</TableCell>
                    <TableCell>{order.user.name}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">₦{order.total.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                        </Button>
                    </TableCell>
                </TableRow>
            ))}
             {orders.length === 0 && !loading && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No orders found.
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

    {selectedOrder && (
        <OrderDetailDialog 
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)}
        />
    )}
    </>
  );
}
