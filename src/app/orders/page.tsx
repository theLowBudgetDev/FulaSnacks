

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

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [reviewSnack, setReviewSnack] = useState<Snack | null>(null);
  const [activePage, setActivePage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  useEffect(() => {
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
  );

  const activeTotalPages = Math.ceil(activeOrders.length / ITEMS_PER_PAGE);
  const paginatedActiveOrders = activeOrders.slice(
      (activePage - 1) * ITEMS_PER_PAGE,
      activePage * ITEMS_PER_PAGE
  );

  const pastTotalPages = Math.ceil(pastOrders.length / ITEMS_PER_PAGE);
  const paginatedPastOrders = pastOrders.slice(
      (pastPage - 1) * ITEMS_PER_PAGE,
      pastPage * ITEMS_PER_PAGE
  );


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
  
  const handleReview = (snack: Snack) => {
    if(!snack) return;
    setReviewSnack(snack);
    setSelectedOrder(null);
  };


  const OrderTable = ({ orders, totalPages, currentPage, onPageChange }: { orders: Order[], totalPages: number, currentPage: number, onPageChange: (page: number) => void }) => (
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
            {orders.length > 0 ? (
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
                     {order.status === 'COMPLETED' && (
                       <Button variant="ghost" size="sm" onClick={() => handleReview(order.items[0]?.snack)}>
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
            <PaginationComponent 
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={onPageChange}
            />
        </CardFooter>
      )}
    </Card>
  );

  return (
    <>
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
            My Orders
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Track your current orders and review your order history.
          </p>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="past">Past Orders</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-6">
            <OrderTable orders={paginatedActiveOrders} totalPages={activeTotalPages} currentPage={activePage} onPageChange={setActivePage} />
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            <OrderTable orders={paginatedPastOrders} totalPages={pastTotalPages} currentPage={pastPage} onPageChange={setPastPage} />
          </TabsContent>
        </Tabs>
      </div>
      {selectedOrder && (
        <OrderDetailDialog 
          order={selectedOrder}
          open={!!selectedOrder}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedOrder(null);
            }
          }}
        />
      )}
       {reviewSnack && (
        <ReviewDialog 
            snack={reviewSnack}
            open={!!reviewSnack}
            onOpenChange={(isOpen) => {
                if(!isOpen) {
                    setReviewSnack(null);
                }
            }}
        />
       )}
    </>
  );
}
