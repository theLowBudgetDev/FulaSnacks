
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Users, Store, Settings, LogOut, ShieldCheck, ShoppingBag } from "lucide-react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/vendors", label: "Vendors", icon: Store },
    { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/admin/login";

    if (isLoginPage) {
        return <>{children}</>;
    }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
                 <Avatar>
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Admin" data-ai-hint="logo shield"/>
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-semibold">FulaSnacks Admin</span>
                    <span className="text-xs text-sidebar-foreground/70">Administrator</span>
                </div>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
                       <Link href={item.href}>
                            <item.icon />
                           <span>{item.label}</span>
                       </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href="/">
                            <LogOut />
                            <span>Logout</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden"/>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-semibold font-headline">
                        {navItems.find(item => item.href === pathname)?.label || 'Admin'}
                    </h1>
                </div>
            </div>
        </header>
        <main className="flex-1 p-6 bg-muted/40">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
