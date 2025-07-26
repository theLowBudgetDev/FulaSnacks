import AdminDashboardPageClient from "./AdminDashboardPageClient";
import { prisma } from "@/lib/prisma";
import { format, subDays } from "date-fns";

export default async function AdminDashboardPage() {
  const sevenDaysAgo = subDays(new Date(), 7);

  const totalRevenue = await prisma.order.aggregate({
    where: { status: "Completed" },
    _sum: { total: true },
  });

  const totalUsers = await prisma.user.count();
  const activeVendors = await prisma.vendor.count({ where: { isApproved: true } });
  const totalOrdersCount = await prisma.order.count();

  const recentOrders = await prisma.order.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  const weeklySales = await prisma.order.findMany({
    where: {
      createdAt: { gte: sevenDaysAgo },
      status: "Completed",
    },
    select: {
      createdAt: true,
      total: true,
    },
  });

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
    <AdminDashboardPageClient
      totalRevenue={totalRevenue._sum.total || 0}
      totalUsers={totalUsers}
      activeVendors={activeVendors}
      totalOrdersCount={totalOrdersCount}
      recentOrders={recentOrders}
      salesData={salesData}
    />
  );
}
