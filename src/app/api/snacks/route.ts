import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 8;
    const skip = (page - 1) * limit;

    const where: any = {
      name: {
        contains: searchTerm,
        mode: 'insensitive',
      },
      vendor: {
        isApproved: true,
      }
    };

    if (category !== 'all') {
      where.category = category;
    }

    const snacks = await prisma.snack.findMany({
      where,
      include: {
        reviews: {
          include: {
            user: true,
          },
        },
        vendor: {
          include: {
            user: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await prisma.snack.count({ where });
    
    const categoryResults = await prisma.snack.groupBy({
      by: ['category'],
       where: {
          vendor: {
            isApproved: true
          }
       }
    });
    const categories = categoryResults.map(c => c.category);


    return NextResponse.json({
      snacks,
      total,
      categories,
    });
  } catch (error) {
    console.error('[API_SNACKS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
