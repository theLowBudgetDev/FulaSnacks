
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
import { useSearchParams } from 'next/navigation';

const ITEMS_PER_PAGE = 5;

export default function OrdersPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewSnack, setReviewSnack] = useState<Snack | null>(null);

  const currentPage = Number(searchParams.get('page')) || 1;
  const currentTab = searchParams.get('tab') || 'active';

  useEffect(() => {
    const fetchOrders = async () => {
      if (session?.user) {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(ITEMS_PER_PAGE),
          status: currentTab === 'active' ? 'active' : 'past'
        });
        const res = await fetch(`/api/orders?${params.toString()}`);
        if(res.ok) {
            const data = await res.json();
            setOrders(data.orders);
            setTotalOrders(data.total);
        }
        setLoading(false);
      }
    };
    fetchOrders();
  }, [session, currentPage, currentTab]);


  const totalPages = Math.ceil(totalOrders / ITEMS_PER_PAGE);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Preparing': return 'secondary';
      case 'Ready for Pickup': return 'default';
      case 'Completed': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const handleReview = (snack: Snack) => {
    if(!snack) return;
    setReviewSnack(snack);
    setSelectedOrder(null);
  };

  const OrderTable = ({ orders, isLoading }: { orders: Order[]; isLoading: boolean }) => (
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
                    {order.status === 'Completed' && (
                      <Button variant="ghost" size="sm" onClick={() => handleReview(order.items[0].snack)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Leave Review
                      </Button>
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
            <OrderTable orders={orders} isLoading={loading} />
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            <OrderTable orders={orders} isLoading={loading} />
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
