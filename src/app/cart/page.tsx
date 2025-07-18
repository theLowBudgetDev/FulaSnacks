
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { PaymentDialog } from "@/components/shared/PaymentDialog";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const subtotal = cart.reduce((acc, item) => acc + item.snack.price * item.quantity, 0);
  const deliveryFee = 200;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    if (cart.length > 0) {
      setIsPaymentDialogOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: "Cannot proceed",
        description: "Your cart is empty.",
      });
    }
  };
  
  const handlePaymentSuccess = () => {
     toast({
      title: "Payment Successful!",
      description: "Your order has been placed.",
    });
    clearCart();
    router.push('/orders');
  }

  return (
    <>
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Your Cart
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Review your items and proceed to checkout.
        </p>
      </div>
      
      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {cart.map(item => (
                    <div key={item.snack.id} className="flex items-center gap-4">
                      <Image 
                        src={item.snack.imageUrl} 
                        alt={item.snack.name} 
                        width={80} 
                        height={80} 
                        className="rounded-md object-cover"
                        data-ai-hint="snack food"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.snack.name}</h3>
                        <p className="text-sm text-muted-foreground">₦{item.snack.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.snack.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4"/>
                         </Button>
                         <Input type="number" value={item.quantity} className="w-16 h-9 text-center" readOnly />
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.snack.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4"/>
                         </Button>
                      </div>
                      <p className="font-semibold w-20 text-right">₦{(item.snack.price * item.quantity).toLocaleString()}</p>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.snack.id)}>
                          <Trash2 className="h-4 w-4"/>
                      </Button>
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
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                 <Separator />
                <div>
                  <h3 className="font-semibold mb-4 font-headline">Payment Method</h3>
                   <div className="space-y-4">
                       <p className="text-sm text-muted-foreground">
                           You will be redirected to our secure payment gateway to complete your purchase.
                       </p>
                       <Button onClick={handleCheckout} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                           <CreditCard className="mr-2 h-5 w-5" />
                           Proceed to Payment
                       </Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any snacks yet.</p>
            <Button asChild>
                <Link href="/">Browse Snacks</Link>
            </Button>
        </div>
      )}
    </div>
    <PaymentDialog
      open={isPaymentDialogOpen}
      onOpenChange={setIsPaymentDialogOpen}
      onConfirm={handlePaymentSuccess}
      amount={total}
    />
    </>
  );
}

