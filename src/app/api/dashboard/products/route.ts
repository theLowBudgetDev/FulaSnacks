import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where: any = {};
  if (search) {
    where.name = { contains: search };
  }

  const products = await prisma.snack.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      vendor: {
        include: {
          user: true
        }
      },
      reviews: true
    }
  });
  const total = await prisma.snack.count({ where });

  return NextResponse.json({ products, total });
}
