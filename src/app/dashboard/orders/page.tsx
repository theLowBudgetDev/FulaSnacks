"use client";

import { useState } from 'react';
import { userOrders } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { Order } from '@/lib/types';

export default function VendorOrdersPage() {
    const [orders, setOrders] = useState<Order[]>(userOrders.filter(order => order.items.some(item => item.snack.vendorId === 'vendor-1')));

    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
        setOrders(currentOrders => currentOrders.map(order => order.id === orderId ? {...order, status: newStatus} : order));
    }

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
            {orders.map(order => (
                <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
