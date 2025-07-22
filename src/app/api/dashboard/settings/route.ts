
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

// GET vendor settings
export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }
    return NextResponse.json(vendor);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// UPDATE vendor settings
export async function PUT(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  try {
    const body = await req.json();
    const { name, description, campusLocation, logoUrl } = body;

    // Update user name
    if (name) {
        await prisma.user.update({
            where: { id: userId },
            data: { name },
        });
    }

    // Update vendor profile
    const updatedVendor = await prisma.vendor.update({
      where: { userId },
      data: {
        description,
        campusLocation,
        logoUrl,
      },
    });

    return NextResponse.json(updatedVendor);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
