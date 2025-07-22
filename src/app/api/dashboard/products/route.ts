
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const vendor = await prisma.vendor.findUnique({ where: { userId } });

  if (!vendor) {
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const where: any = {
    vendorId: vendor.id,
  };

  const products = await prisma.snack.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  
  const total = await prisma.snack.count({ where });

  return NextResponse.json({ products, total });
}
