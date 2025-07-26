import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Change user role
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { role, suspended } = await req.json();
  const data: any = {};
  if (role) data.role = role;
  if (typeof suspended === 'boolean') data.suspended = suspended;
  const user = await prisma.user.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(user);
}

// Delete user (optional, not in UI yet)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
