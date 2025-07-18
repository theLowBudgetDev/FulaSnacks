
"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreditCard, Loader2, CheckCircle } from "lucide-react";

const paymentFormSchema = z.object({
  cardNumber: z.string().refine((value) => /^\d{16}$/.test(value), {
    message: "Card number must be 16 digits.",
  }),
  expiryDate: z.string().refine((value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), {
    message: "Expiry date must be in MM/YY format.",
  }),
  cvc: z.string().refine((value) => /^\d{3}$/.test(value), {
    message: "CVC must be 3 digits.",
  }),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  amount: number;
}

export function PaymentDialog({ open, onOpenChange, onConfirm, amount }: PaymentDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const onSubmit = (data: PaymentFormValues) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirm();
        onOpenChange(false);
        // Reset state after dialog closes
        setTimeout(() => setIsSuccess(false), 500);
      }, 1500);
    }, 2000); 
  };
  
   const handleOpenChange = (isOpen: boolean) => {
    if (!isProcessing) {
        onOpenChange(isOpen);
        if (!isOpen) {
            form.reset();
            setIsSuccess(false);
        }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4 animate-in zoom-in-50" />
            <h2 className="text-2xl font-bold font-headline mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground">Your order has been placed.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Complete Your Payment</DialogTitle>
              <DialogDescription>
                Enter your card details to pay ₦{amount.toLocaleString()}. This is a simulation.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="0000 0000 0000 0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="cvc"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                            <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
                        Cancel
                    </Button>
                    <Button type="submit" className="w-40" disabled={isProcessing}>
                        {isProcessing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Pay ₦{amount.toLocaleString()}
                            </>
                        )}
                    </Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
