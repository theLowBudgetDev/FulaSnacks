"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleVendorSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // This is where you would add your user creation logic for vendors.
    toast({
      title: "Vendor Account Created!",
      description: "Redirecting you to the login page...",
    });
    router.push('/login');
  }
  
  const handleCustomerSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // This is where you would add your user creation logic for customers.
    toast({
      title: "Account Created!",
      description: "You can now log in.",
    });
    router.push('/login');
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>Join FulaSnacks to order snacks or sell your products.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="customer" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="customer">I'm a Customer</TabsTrigger>
                    <TabsTrigger value="vendor">I'm a Vendor</TabsTrigger>
                </TabsList>
                <TabsContent value="customer" className="mt-4">
                     <form className="space-y-4" onSubmit={handleCustomerSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="customer-fullname">Full Name</Label>
                            <Input id="customer-fullname" type="text" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customer-email">Email</Label>
                            <Input id="customer-email" type="email" placeholder="student@fulafia.edu.ng" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customer-password">Password</Label>
                            <Input id="customer-password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Create Customer Account
                        </Button>
                    </form>
                </TabsContent>
                <TabsContent value="vendor" className="mt-4">
                     <form className="space-y-4" onSubmit={handleVendorSubmit}>
                         <div className="space-y-2">
                            <Label htmlFor="vendor-name">Business Name</Label>
                            <Input id="vendor-name" type="text" placeholder="Mama Put Delights" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vendor-email">Business Email</Label>
                            <Input id="vendor-email" type="email" placeholder="vendor@fulafia.edu.ng" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vendor-password">Password</Label>
                            <Input id="vendor-password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Create Vendor Account
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm text-muted-foreground w-full">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
