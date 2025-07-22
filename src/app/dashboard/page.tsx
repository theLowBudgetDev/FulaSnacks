
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import {
  DollarSign,
  ShoppingBag,
  Package,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { format, subDays } from "date-fns";

const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Preparing':
        return 'secondary';
      case 'Ready for Pickup':
        return 'default';
      case 'Completed':
        return 'outline';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
};

export default async function DashboardPage() {
    const session = await getServerSession();
    if (!session || !session.user || !(session.user as any).id) {
        redirect('/login');
    }

    const userId = (session.user as any).id;
    const vendor = await prisma.vendor.findUnique({ where: { userId }});

    if (!vendor) {
        return <div>You are not a vendor.</div>
    }

    const sevenDaysAgo = subDays(new Date(), 7);

    const stats = await prisma.$transaction([
        prisma.order.aggregate({
            where: { items: { some: { snack: { vendorId: vendor.id }}}, status: "Completed" },
            _sum: { total: true }
        }),
        prisma.order.count({
            where: { items: { some: { snack: { vendorId: vendor.id }}}}
        }),
        prisma.snack.count({
            where: { vendorId: vendor.id }
        }),
        prisma.order.findMany({
            where: { items: { some: { snack: { vendorId: vendor.id }}}},
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        }),
        prisma.order.findMany({
            where: {
                createdAt: { gte: sevenDaysAgo },
                status: "Completed",
                items: { some: { snack: { vendorId: vendor.id }}}
            },
            select: { createdAt: true, total: true }
        })
    ]);

    const totalRevenue = stats[0]._sum.total || 0;
    const totalOrders = stats[1];
    const totalProducts = stats[2];
    const recentOrders = stats[3];
    const weeklySales = stats[4];

    const salesData = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
            name: format(date, "EEE"),
            total: 0,
        };
    });

    weeklySales.forEach((sale) => {
        const dayName = format(sale.createdAt, "EEE");
        const day = salesData.find((d) => d.name === dayName);
        if (day) {
            day.total += sale.total;
        }
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From completed orders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Across all time
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Total products available
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{recentOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              In the last few orders
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
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
              A summary of your latest incoming orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                            <TableCell>
                                <div className="font-medium">{order.user.name}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    {order.user.email}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(order.status) as any}>{order.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">₦{order.total.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                    {recentOrders.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center h-24">
                                No recent orders.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
