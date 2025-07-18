
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    const form = event.currentTarget as HTMLFormElement;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
         toast({
          variant: 'destructive',
          title: "Login Failed",
          description: "Invalid credentials or you are not an admin.",
        });
      } else if (res?.ok) {
         // We need to fetch the session to check the role
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();

        if (session?.user?.role === 'ADMIN') {
            toast({
              title: "Login Successful",
              description: "Redirecting to the admin dashboard...",
            });
            router.push('/admin');
        } else {
            signOut({ redirect: false });
            toast({
              variant: 'destructive',
              title: "Access Denied",
              description: "You do not have permission to access the admin dashboard.",
            });
        }
      }
    } catch (error) {
        toast({
          variant: 'destructive',
          title: "Login Error",
          description: "An unexpected error occurred.",
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Admin Login</CardTitle>
          <CardDescription>Log in to manage the FulaSnacks platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@fulafia.edu.ng" required disabled={loading} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled={loading} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login to Admin Dashboard'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
