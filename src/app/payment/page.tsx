
"use client";

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/context/CartContext';
import { CheckCircle, CreditCard } from 'lucide-react';

function PaymentComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const amount = searchParams.get('amount') || '0';

  const handleConfirmPayment = () => {
    toast({
      title: "Payment Successful!",
      description: "Your order has been placed.",
    });
    clearCart();
    router.push('/orders');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
                <CreditCard className="h-8 w-8 text-green-700"/>
            </div>
            <CardTitle className="font-headline text-2xl mt-4">Confirm Payment</CardTitle>
            <CardDescription>You are about to pay the sum of</CardDescription>
            <p className="text-4xl font-bold font-headline text-foreground">
                ₦{Number(amount).toLocaleString()}
            </p>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground text-center">
                This is a simulation. No real payment will be processed. Click the button below to confirm your order.
            </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleConfirmPayment} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
            <CheckCircle className="mr-2 h-5 w-5" />
            Pay ₦{Number(amount).toLocaleString()}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentComponent />
        </Suspense>
    )
}
