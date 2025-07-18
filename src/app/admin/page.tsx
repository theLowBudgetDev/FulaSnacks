
<<<<<<< HEAD

"use client";

=======
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  Users,
  Store,
  Utensils,
  ArrowRight,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
<<<<<<< HEAD
import { useEffect, useState } from 'react';
import type { Order, User, Vendor } from '@/lib/types';
import prisma from '@/lib/prisma';

const salesData = [
  { name: "Mon", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Tue", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Wed", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Thu", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Fri", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sat", total: Math.floor(Math.random() * 5000) + 1000 },
  { name: "Sun", total: Math.floor(Math.random() * 5000) + 1000 },
];
=======
import { prisma } from '@/lib/prisma';
import { format, subDays } from 'date-fns';
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c

const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PREPARING':
        return 'secondary';
      case 'READY_FOR_PICKUP':
        return 'default';
      case 'COMPLETED':
        return 'outline';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'outline';
    }
};

<<<<<<< HEAD
export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    approvedVendors: 0,
    totalOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/stats');
            const data = await response.json();
            setStats(data.stats);
            setRecentOrders(data.recentOrders);
        } catch (error) {
            console.error("Failed to fetch admin stats:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, []);

=======
export default async function AdminDashboardPage() {
  const sevenDaysAgo = subDays(new Date(), 7);

  const totalRevenue = await prisma.order.aggregate({
    where: { status: 'Completed' },
    _sum: { total: true },
  });

  const totalUsers = await prisma.user.count();
  const activeVendors = await prisma.vendor.count({ where: { isApproved: true } });
  const totalOrdersCount = await prisma.order.count();

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  const weeklySales = await prisma.order.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: 'Completed',
    },
    select: {
      createdAt: true,
      total: true,
    },
  });

  const salesData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      name: format(date, 'EEE'),
      total: 0,
    };
  });

  weeklySales.forEach(sale => {
    const dayName = format(sale.createdAt, 'EEE');
    const day = salesData.find(d => d.name === dayName);
    if (day) {
      day.total += sale.total;
    }
  });
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="text-2xl font-bold">₦{stats.totalRevenue.toLocaleString()}</div>
=======
            <div className="text-2xl font-bold">₦{(totalRevenue._sum.total || 0).toLocaleString()}</div>
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
            <p className="text-xs text-muted-foreground">
              Across all vendors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
=======
            <div className="text-2xl font-bold">{totalUsers}</div>
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
            <p className="text-xs text-muted-foreground">
              Customers and Vendors
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="text-2xl font-bold">{stats.approvedVendors}</div>
=======
            <div className="text-2xl font-bold">{activeVendors}</div>
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
            <p className="text-xs text-muted-foreground">
              Total approved vendors
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
<<<<<<< HEAD
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
=======
            <div className="text-2xl font-bold">{totalOrdersCount}</div>
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
            <p className="text-xs text-muted-foreground">
              In platform history
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
             <CardDescription>
              Weekly sales data across the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₦${value/1000}k`}
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              A view of the latest orders across all vendors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>
                                <div className="font-medium">{order.id.substring(0,8)}...</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
<<<<<<< HEAD
                                    {order.user?.email}
=======
                                    {order.user.email}
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(order.status) as any}>{order.status.replace('_', ' ')}</Badge>
                            </TableCell>
                            <TableCell className="text-right">₦{order.total.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                     {recentOrders.length === 0 && !loading && (
                        <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                                No recent orders.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
           <CardFooter className="justify-end">
            <Button asChild variant="link" size="sm">
                <Link href="/admin/orders">
                    View All Orders
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
