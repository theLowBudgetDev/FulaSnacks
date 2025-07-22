
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idsString = searchParams.get('ids');

    if (!idsString) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    const ids = idsString.split(',');

    const snacks = await prisma.snack.findMany({
      where: {
        id: {
          in: ids,
        },
        vendor: {
            isApproved: true,
        }
      },
      include: {
        vendor: { include: { user: true } },
        reviews: { include: { user: true } },
      },
    });

    return NextResponse.json(snacks);
  } catch (error) {
    console.error('[API_SNACKS_BY_IDS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
