
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
    
    // Generate a random avatar URL
    const randomAvatarId = Math.floor(Math.random() * 70) + 1;
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${randomAvatarId}.jpg`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        avatarUrl,
      },
    });
    
    // If the user is a vendor, create a vendor profile
    if (role === 'VENDOR') {
      await prisma.vendor.create({
        data: {
          userId: user.id,
          description: `${name} is a vendor on FulaSnacks offering delicious snacks to students at Federal University Lafia.`,
          campusLocation: 'Main Campus',
          logoUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?q=80&w=400&h=400&auto=format&fit=crop`,
          isApproved: false, // Vendors need approval before they can sell
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return new NextResponse('Internal Server Error', {status: 500});
  }
}
