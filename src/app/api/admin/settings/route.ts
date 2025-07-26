import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET admin settings
export async function GET() {
  // For demo: fetch admin user and platform settings (commission, delivery fee, etc.)
  // In real app, you might have a settings table or use the first admin user
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  // Assume settings are stored in a Settings table, fallback to defaults if not found
  let settings = await prisma.settings.findFirst();
  if (!settings) {
    settings = { commissionRate: 5, deliveryFee: 200, enableNotifications: true, enableAutoApproval: false };
  }
  return NextResponse.json({
    admin: { name: admin?.name, email: admin?.email },
    ...settings,
  });
}

// UPDATE admin settings
export async function PUT(req: Request) {
  const body = await req.json();
  // Update admin user
  if (body.adminName || body.adminEmail) {
    await prisma.user.updateMany({ where: { role: 'ADMIN' }, data: { name: body.adminName, email: body.adminEmail } });
  }
  // Update or create platform settings
  let settings = await prisma.settings.findFirst();
  if (settings) {
    await prisma.settings.update({ where: { id: settings.id }, data: body });
  } else {
    await prisma.settings.create({ data: body });
  }
  return NextResponse.json({ success: true });
}
