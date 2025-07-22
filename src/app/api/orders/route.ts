
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

// GET orders for the logged-in user
export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const statusFilter = searchParams.get("status"); // 'active' or 'past'
  const skip = (page - 1) * limit;

  let where: any = { userId };

  if (statusFilter === 'active') {
      where.status = { in: ['Preparing', 'Ready for Pickup'] };
  } else if (statusFilter === 'past') {
      where.status = { in: ['Completed', 'Cancelled'] };
  }

  try {
    const orders = await prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            snack: true,
          },
        },
        user: true, // Though it's the current user, it's good practice
      },
    });

    const total = await prisma.order.count({ where });

    return NextResponse.json({ orders, total });
  } catch (error) {
    console.error('[API_ORDERS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
