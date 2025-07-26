import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Update vendor approval status
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { isApproved } = await req.json();
    const vendor = await prisma.vendor.update({
      where: { id: params.id },
      data: { isApproved },
    });
    return NextResponse.json(vendor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}

// Delete vendor
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.vendor.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete vendor' }, { status: 500 });
  }
}
