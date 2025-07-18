
"use client";

import { useState } from 'react';
import { userOrders } from "@/lib/placeholder-data";
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

const ITEMS_PER_PAGE = 10;

export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const filteredOrders = userOrders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || order.userId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

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
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
            }}>
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
              <TableHead>User ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map(order => (
                <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
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
             {paginatedOrders.length === 0 && (
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
            onPageChange={setCurrentPage}
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
