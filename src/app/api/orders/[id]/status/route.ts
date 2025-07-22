
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

// UPDATE order status (for vendors)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;

  try {
    const { status } = await req.json();
    const orderId = params.id;

    // Check if the user is a vendor and owns the product in the order
    if (userRole === 'VENDOR') {
        const vendor = await prisma.vendor.findUnique({ where: { userId }});
        if (!vendor) {
             return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
        }
        const orderItem = await prisma.orderItem.findFirst({
            where: {
                orderId: orderId,
                snack: {
                    vendorId: vendor.id,
                }
            }
        });

        if (!orderItem) {
            return NextResponse.json({ error: "Not authorized to update this order" }, { status: 403 });
        }
    } else if (userRole !== 'ADMIN') {
         return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }


    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[API_ORDER_STATUS_PUT]", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
