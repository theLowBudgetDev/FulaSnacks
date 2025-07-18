
"use client";

import Link from "next/link";
import {
  ShoppingCart,
  User,
  UtensilsCrossed,
  Menu,
  LayoutGrid,
  LogOut,
  ShoppingBag as ShoppingBagIcon,
  Heart,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/snacks", label: "All Snacks" },
  { href: "/vendors", label: "Vendors" },
];

export default function Header() {
  const pathname = usePathname();
  const { cart } = useCart();
  const { data: session } = useSession();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const user = session?.user as any;
  const isLoggedIn = !!user;

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
                </SheetTrigger>
                <SheetContent side="left">
                <div className="flex flex-col gap-6 p-6">
                    <Link href="/" className="flex items-center gap-2">
                    <UtensilsCrossed className="h-6 w-6 text-primary" />
                    <span className="font-headline text-lg font-bold">FulaSnacks</span>
                    </Link>
                    <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "text-lg font-medium transition-colors hover:text-primary",
                            pathname === link.href ? "text-primary" : "text-foreground"
                        )}
                        >
                        {link.label}
                        </Link>
                    ))}
                    </nav>
                </div>
                </SheetContent>
            </Sheet>
        </div>

        <div className="flex flex-1 items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
                <UtensilsCrossed className="h-6 w-6 text-primary" />
                <span className="hidden font-headline text-lg font-bold sm:inline-block">FulaSnacks</span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
                {navLinks.map((link) => (
                <NavLink key={link.href} {...link} />
                ))}
            </nav>
        </div>
        
        <div className="flex items-center justify-end gap-2">
          <Button asChild variant="ghost" size="icon" className="relative hover:bg-transparent">
            <Link href="/cart">
                <ShoppingCart className="h-5 w-5 text-foreground" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{cartItemCount}</Badge>
                )}
                <span className="sr-only">Cart</span>
            </Link>
          </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-transparent">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image || "https://placehold.co/100x100.png"} alt={user?.name || "User"} data-ai-hint="person avatar"/>
                        <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">User Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isLoggedIn ? (
                    <>
                        <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/orders"><ShoppingBagIcon className="mr-2 h-4 w-4" />My Orders</Link>
                        </DropdownMenuItem>
                        
                        {(user.role === 'ADMIN' || user.role === 'VENDOR') && <DropdownMenuSeparator />}
                        
                        {user.role === 'ADMIN' && (
                            <DropdownMenuItem asChild>
                                <Link href="/admin"><ShieldCheck className="mr-2 h-4 w-4" />Admin Dashboard</Link>
                            </DropdownMenuItem>
                        )}
                        {user.role === 'VENDOR' && (
                           <DropdownMenuItem asChild>
                                <Link href="/dashboard"><LayoutGrid className="mr-2 h-4 w-4" />Vendor Dashboard</Link>
                            </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                            <LogOut className="mr-2 h-4 w-4" />Logout
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem asChild>
                           <Link href="/login">Login</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href="/signup">Sign Up</Link>
                        </DropdownMenuItem>
                    </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
