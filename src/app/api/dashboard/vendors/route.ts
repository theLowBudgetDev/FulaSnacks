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
    where.OR = [
      { name: { contains: search } },
      { user: { email: { contains: search } } },
    ];
  }

  const vendors = await prisma.vendor.findMany({
    where,
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
  const