
"use client";

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { Order } from '@/lib/types';
import { PaginationComponent } from '@/components/shared/PaginationComponent';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

export default function VendorOrdersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalOrders, setTotalOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const currentPage = Number(searchParams.get('page')) || 1;

    useEffect(() => {
      async function fetchOrders() {
        setLoading(true);
        try {
          const params = new URLSearchParams({
            page: String(currentPage),
            limit: String(ITEMS_PER_PAGE)
          });
          const response = await fetch(`/api/dashboard/orders?${params.toString()}`);
          if (!response.ok) throw new Error("Failed to fetch");
          const data = await response.json();
          setOrders(data.orders);
          setTotalOrders(data.total);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not fetch orders."
          });
        } finally {
          setLoading(false);
        }
      }
      fetchOrders();
    }, [currentPage, toast]);

    const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const originalOrders = [...orders];
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);

        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }
            toast({
                title: "Status Updated",
                description: `Order status has been changed to ${newStatus.replace('_', ' ')}.`,
            });
        } catch (error) {
            setOrders(originalOrders);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Could not update order status.",
            });
        }
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
          case 'Preparing':
            return 'secondary';
          case 'Ready for Pickup':
            return 'default';
          case 'Completed':
            return 'outline';
          case 'Cancelled':
            return 'destructive';
          default:
            return 'outline';
        }
    };
    
  return (
    <Card>
        <CardHeader>
            <CardTitle>Incoming Orders</CardTitle>
            <CardDescription>View and manage orders for your products.</CardDescription>
        </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                 Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell>
                    </TableRow>
                ))
            ) : orders.map(order => (
                <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0,8)}...</TableCell>
                    <TableCell>{order.user?.name}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(order.status) as any}>{order.status.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell className="text-right">₦{order.total.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Preparing')}>Preparing</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Ready for Pickup')}>Ready for Pickup</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Completed')}>Completed</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
             {orders.length === 0 && !loading && (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No orders yet.
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
  );
}
