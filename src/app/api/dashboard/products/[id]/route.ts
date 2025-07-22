
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

// UPDATE a product
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const body = await req.json();
        const { name, description, price, category, imageUrl } = body;
        
        const updatedSnack = await prisma.snack.update({
            where: { id: params.id },
            data: {
                name,
                description,
                price,
                category,
                imageUrl,
            }
        });

        return NextResponse.json(updatedSnack);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}

// DELETE a product
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession();
    if (!session || !session.user || !(session.user as any).id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await prisma.snack.delete({
            where: { id: params.id },
        });

        return new NextResponse(null, { status: 204 }); // No Content
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
