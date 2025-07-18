import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const snacks = await prisma.snack.findMany({
      include: {
        reviews: {
            include: {
                user: true
            }
        },
        vendor: {
            include: {
                user: true
            }
        }
      },
    });

    const categories = await prisma.snack.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    return NextResponse.json({ 
        snacks, 
        categories: categories.map(c => c.category) 
    });
  } catch (error) {
    console.error('[API_SNACKS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
