import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.OR = [
      { id: { contains: search } },
      { user: { email: { contains: search } } },
    ];
  }
  if (status !== "all") {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: true, // Only include valid relations
    },
  });
  const total = await prisma.order.count({ where });

  return NextResponse.json({ orders, total });
}