
"use client";

import { Suspense } from 'react';
import { usePathname } from "next/navigation";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');
  const isAdmin = pathname.startsWith('/admin');
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/payment') || pathname.startsWith('/admin/login');

  const showHeaderFooter = !isDashboard && !isAdmin && !isAuthPage;

  return (
    <html lang="en" className="light">
      <head>
        <title>FulaSnacks</title>
        <meta name="description" content="The easiest way to order snacks on campus." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FavoritesProvider>
          <CartProvider>
              <Suspense>
                {showHeaderFooter ? (
                    <div className="flex min-h-screen flex-col">
                      <Header />
                      <main className="flex-1">{children}</main>
                      <Footer />
                    </div>
                ) : (
                  children
                )}
                <Toaster />
              </Suspense>
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
