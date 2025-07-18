
"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent, role: 'CUSTOMER' | 'VENDOR') => {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    
    try {
      const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              name,
              email,
              password,
              role,
          }),
      });

      if (res.ok) {
          toast({
              title: "Account Created!",
              description: "Redirecting you to the login page...",
          });
          router.push('/login');
      } else {
          const data = await res.json();
          toast({
              variant: "destructive",
              title: "Signup Failed",
              description: data.error || "Something went wrong.",
          });
      }
    } catch (error) {
         toast({
              variant: "destructive",
              title: "Signup Error",
              description: "An unexpected error occurred.",
          });
    } finally {
        setLoading(false);
    }
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
                     <form className="space-y-4" onSubmit={(e) => handleSubmit(e, 'CUSTOMER')}>
                        <div className="space-y-2">
                            <Label htmlFor="customer-fullname">Full Name</Label>
                            <Input id="customer-fullname" name="name" type="text" placeholder="John Doe" required disabled={loading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customer-email">Email</Label>
                            <Input id="customer-email" name="email" type="email" placeholder="student@fulafia.edu.ng" required disabled={loading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customer-password">Password</Label>
                            <Input id="customer-password" name="password" type="password" required disabled={loading} />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating..." : "Create Customer Account"}
                        </Button>
                    </form>
                </TabsContent>
                <TabsContent value="vendor" className="mt-4">
                     <form className="space-y-4" onSubmit={(e) => handleSubmit(e, 'VENDOR')}>
                         <div className="space-y-2">
                            <Label htmlFor="vendor-name">Business Name</Label>
                            <Input id="vendor-name" name="name" type="text" placeholder="Mama Put Delights" required disabled={loading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vendor-email">Business Email</Label>
                            <Input id="vendor-email" name="email" type="email" placeholder="vendor@fulafia.edu.ng" required disabled={loading}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vendor-password">Password</Label>
                            <Input id="vendor-password" name="password" type="password" required disabled={loading}/>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                             {loading ? "Creating..." : "Create Vendor Account"}
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
