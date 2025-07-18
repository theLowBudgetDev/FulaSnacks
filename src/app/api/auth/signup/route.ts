
import {NextResponse} from 'next/server';
import bcrypt from 'bcryptjs';
import {prisma} from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const {name, email, password, role} = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {error: 'Missing required fields'},
        {status: 400}
      );
    }

    const exist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (exist) {
      return NextResponse.json(
        {error: 'User already exists'},
        {status: 400}
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', {status: 500});
  }
}
