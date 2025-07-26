import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { format, subDays } from "date-fns";
import DashboardPageClient from "./DashboardPageClient";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
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
            take: 3,
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
    <DashboardPageClient
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        totalProducts={totalProducts}
        recentOrders={recentOrders}
        salesData={salesData}
    />
  );
}
