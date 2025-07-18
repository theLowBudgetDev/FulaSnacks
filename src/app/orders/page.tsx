
<<<<<<< HEAD

"use client";

import { useState, useEffect } from "react";
import type { Order, Snack } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare } from "lucide-react";
import { OrderDetailDialog } from "@/components/shared/OrderDetailDialog";
import { PaginationComponent } from "@/components/shared/PaginationComponent";
import { ReviewDialog } from "@/components/shared/ReviewDialog";
=======
'use client';

import { useState, useEffect } from 'react';
import type { Order, Snack } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, MessageSquare } from 'lucide-react';
import { OrderDetailDialog } from '@/components/shared/OrderDetailDialog';
import { PaginationComponent } from '@/components/shared/PaginationComponent';
import { ReviewDialog } from '@/components/shared/ReviewDialog';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
<<<<<<< HEAD
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

=======
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewSnack, setReviewSnack] = useState<Snack | null>(null);
  const [activePage, setActivePage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  useEffect(() => {
<<<<<<< HEAD
    async function fetchOrders() {
      setLoading(true);
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error("Failed to fetch orders");
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);


  const activeOrders = orders.filter(
    (order) => order.status === "PREPARING" || order.status === "READY_FOR_PICKUP"
  );
  const pastOrders = orders.filter(
    (order) => order.status === "COMPLETED" || order.status === "CANCELLED"
=======
    const fetchOrders = async () => {
      if (session?.user) {
        setLoading(true);
        // In a real app, this would be an API call to `/api/orders`
        // For now, we simulate. In your app, you would fetch from an API route.
        // const res = await fetch('/api/orders');
        // const userOrders = await res.json();
        // setOrders(userOrders);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [session]);

  const activeOrders = orders.filter(
    (order) => order.status === 'Preparing' || order.status === 'Ready for Pickup'
  );
  const pastOrders = orders.filter(
    (order) => order.status === 'Completed' || order.status === 'Cancelled'
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
  );

  const activeTotalPages = Math.ceil(activeOrders.length / ITEMS_PER_PAGE);
  const paginatedActiveOrders = activeOrders.slice((activePage - 1) * ITEMS_PER_PAGE, activePage * ITEMS_PER_PAGE);

  const pastTotalPages = Math.ceil(pastOrders.length / ITEMS_PER_PAGE);
  const paginatedPastOrders = pastOrders.slice((pastPage - 1) * ITEMS_PER_PAGE, pastPage * ITEMS_PER_PAGE);

  const getStatusVariant = (status: string) => {
    switch (status) {
<<<<<<< HEAD
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
=======
      case 'Preparing': return 'secondary';
      case 'Ready for Pickup': return 'default';
      case 'Completed': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
    }
  };

  const handleReview = (snack: Snack) => {
    if(!snack) return;
    setReviewSnack(snack);
    setSelectedOrder(null);
  };

<<<<<<< HEAD

  const OrderTable = ({ orders, totalPages, currentPage, onPageChange }: { orders: Order[], totalPages: number, currentPage: number, onPageChange: (page: number) => void }) => (
=======
  const OrderTable = ({ orders, totalPages, currentPage, onPageChange, isLoading }: { orders: Order[]; totalPages: number; currentPage: number; onPageChange: (page: number) => void; isLoading: boolean }) => (
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-[100px] rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-[60px] ml-auto" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-[120px] ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status) as any}>{order.status.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell className="text-right">₦{order.total.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
<<<<<<< HEAD
                     {order.status === 'COMPLETED' && (
                       <Button variant="ghost" size="sm" onClick={() => handleReview(order.items[0]?.snack)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Leave Review
                       </Button>
=======
                    {order.status === 'Completed' && (
                      <Button variant="ghost" size="sm" onClick={() => handleReview(order.items[0].snack)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Leave Review
                      </Button>
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      {totalPages > 1 && (
        <CardFooter>
          <PaginationComponent totalPages={totalPages} currentPage={currentPage} />
        </CardFooter>
      )}
    </Card>
  );

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">My Orders</h1>
          <p className="mt-2 text-lg text-muted-foreground">Track your current orders and review your order history.</p>
        </div>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="past">Past Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-6">
            <OrderTable orders={paginatedActiveOrders} totalPages={activeTotalPages} currentPage={activePage} onPageChange={setActivePage} isLoading={loading} />
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            <OrderTable orders={paginatedPastOrders} totalPages={pastTotalPages} currentPage={pastPage} onPageChange={setPastPage} isLoading={loading} />
          </TabsContent>
        </Tabs>
      </div>
      {selectedOrder && (
        <OrderDetailDialog order={selectedOrder} open={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)} />
      )}
      {reviewSnack && (
        <ReviewDialog snack={reviewSnack} open={!!reviewSnack} onOpenChange={(isOpen) => !isOpen && setReviewSnack(null)} />
      )}
    </>
  );
}
