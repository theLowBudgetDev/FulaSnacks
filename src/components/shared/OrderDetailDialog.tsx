
"use client";

import Image from "next/image";
import type { Order } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Truck, Clock, CheckCircle, XCircle } from "lucide-react";

interface OrderDetailDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {

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
            return <Clock className="h-4 w-4" />;
        case 'Ready for Pickup':
            return <Truck className="h-4 w-4" />;
        case 'Completed':
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'Cancelled':
            return <XCircle className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
    }
  }
  
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 200; // Assuming a fixed delivery fee

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Order {order.id.substring(0,8)}...</DialogTitle>
          <DialogDescription>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
            <div className="flex items-center gap-3">
                <Badge variant={getStatusVariant(order.status) as any} className="flex items-center gap-2 pl-2 pr-3 py-1 text-sm">
                    {getStatusIcon(order.status)}
                    {order.status.replace('_', ' ')}
                </Badge>
            </div>
          <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <Image
                  src={item.snack?.imageUrl || "/placeholder_snack.png"}
                  alt={item.snack?.name || "Unknown Snack"}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                  data-ai-hint="snack food"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{item.snack?.name || "Unknown Snack"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} x ₦{item.snack?.price?.toLocaleString() || item.price?.toLocaleString() || "-"}
                  </p>
                </div>
                <p className="font-semibold text-right">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="grid gap-2">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
