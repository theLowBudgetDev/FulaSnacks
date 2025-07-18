

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

const ITEMS_PER_PAGE = 10;

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();

    useEffect(() => {
      async function fetchOrders() {
        setLoading(true);
        try {
          // In a real app with auth, you'd fetch for a specific vendor
          const response = await fetch('/api/dashboard/orders');
          const data = await response.json();
          setOrders(data);
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
    }, [toast]);

    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
    const paginatedOrders = orders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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
          case 'PREPARING':
            return 'secondary';
          case 'READY_FOR_PICKUP':
            return 'default';
          case 'COMPLETED':
            return 'outline';
          case 'CANCELLED':
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
            {paginatedOrders.map(order => (
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
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'PREPARING')}>Preparing</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'READY_FOR_PICKUP')}>Ready for Pickup</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'COMPLETED')}>Completed</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
             {paginatedOrders.length === 0 && (
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
            onPageChange={setCurrentPage}
        />
      </CardFooter>
    </Card>
  );
}
