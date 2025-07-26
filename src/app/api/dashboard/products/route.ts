
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function getVendorId(userId: string) {
    const vendor = await prisma.vendor.findUnique({ where: { userId } });
    if (!vendor) {
        throw new Error("Vendor not found");
    }
    return vendor.id;
}

// GET all products for a vendor
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    
    try {
        const vendorId = await getVendorId(userId);
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || "1");
        const limit = Number(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        const where: any = { vendorId };

        const products = await prisma.snack.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });
        
        const total = await prisma.snack.count({ where });

        return NextResponse.json({ products, total });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 404 });
    }
}

// POST a new product for a vendor
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    try {
        const vendorId = await getVendorId(userId);
        const body = await req.json();
        const { name, description, price, category, imageUrl } = body;
        
        const newSnack = await prisma.snack.create({
            data: {
                name,
                description,
                price,
                category,
                imageUrl,
                vendorId,
            }
        });

        return NextResponse.json(newSnack, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message.includes("Vendor not found")) {
             return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
