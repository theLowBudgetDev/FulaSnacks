import Image from "next/image";
import { notFound } from "next/navigation";
import { userOrders } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Truck, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = userOrders.find((o) => o.id === params.id);

  if (!order) {
    notFound();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Preparing':
            return <Clock className="h-5 w-5 text-secondary-foreground" />;
        case 'Ready for Pickup':
            return <Truck className="h-5 w-5 text-primary-foreground" />;
        case 'Completed':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'Cancelled':
            return <XCircle className="h-5 w-5 text-destructive-foreground" />;
        default:
            return <Clock className="h-5 w-5" />;
    }
  }
  
  const subtotal = order.items.reduce((acc, item) => acc + item.snack.price * item.quantity, 0);
  const deliveryFee = 200; // Assuming a fixed delivery fee

  return (
    <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/orders">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Back to Orders
                </Link>
            </Button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order {order.id}</CardTitle>
              <CardDescription>
                Placed on {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={item.snack.id} className="flex items-center gap-4">
                    <Image
                      src={item.snack.imageUrl}
                      alt={item.snack.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                      data-ai-hint="snack food"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.snack.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x ₦{item.snack.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₦{(item.snack.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="flex items-center gap-3">
                    <Badge variant={getStatusVariant(order.status) as any} className="flex items-center gap-2 pl-2 pr-3 py-1 text-sm">
                        {getStatusIcon(order.status)}
                        {order.status}
                    </Badge>
               </div>
              <Separator />
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₦{order.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
