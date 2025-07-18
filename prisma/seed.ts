<<<<<<< HEAD
import { PrismaClient } from '@prisma/client'
=======

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

<<<<<<< HEAD
  // Create Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fulafia.edu.ng' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@fulafia.edu.ng',
      avatarUrl: 'https://placehold.co/100x100.png',
      role: 'ADMIN',
    },
  });

  const vendorUser1 = await prisma.user.upsert({
     where: { email: 'mamaput@fulafia.edu.ng' },
     update: {},
    create: {
      name: 'Mama Put',
      email: 'mamaput@fulafia.edu.ng',
      avatarUrl: 'https://placehold.co/100x100.png',
      role: 'VENDOR',
    },
  });

  const vendorUser2 = await prisma.user.upsert({
    where: { email: 'juicebar@fulafia.edu.ng' },
    update: {},
    create: {
      name: 'Juice Bar Owner',
      email: 'juicebar@fulafia.edu.ng',
      avatarUrl: 'https://placehold.co/100x100.png',
      role: 'VENDOR',
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: 'alex.doe@fulafia.edu.ng' },
    update: {},
    create: {
        name: 'Alex Doe',
        email: 'alex.doe@fulafia.edu.ng',
        avatarUrl: 'https://placehold.co/100x100.png',
        role: 'CUSTOMER'
    }
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'jane.smith@fulafia.edu.ng' },
    update: {},
    create: {
        name: 'Jane Smith',
        email: 'jane.smith@fulafia.edu.ng',
        avatarUrl: 'https://placehold.co/100x100.png',
        role: 'CUSTOMER'
    }
  });


  // Create Vendors
  const vendor1 = await prisma.vendor.upsert({
    where: { ownerId: vendorUser1.id },
    update: {},
    create: {
      name: 'Mama Put Delights',
=======
  // Clear existing data
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.snack.deleteMany()
  await prisma.vendor.deleteMany()
  await prisma.user.deleteMany()

  // --- Create Users ---
  const hashedPassword = await bcrypt.hash('password123', 10)

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@fulafia.edu.ng',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      avatarUrl: 'https://placehold.co/100x100.png',
    },
  })

  const customer1 = await prisma.user.create({
    data: {
      email: 'alex.doe@fulafia.edu.ng',
      name: 'Alex Doe',
      password: hashedPassword,
      role: 'CUSTOMER',
      avatarUrl: 'https://placehold.co/100x100.png',
    },
  })

  const customer2 = await prisma.user.create({
    data: {
      email: 'jane.smith@fulafia.edu.ng',
      name: 'Jane Smith',
      password: hashedPassword,
      role: 'CUSTOMER',
      avatarUrl: 'https://placehold.co/100x100.png',
    },
  })

  const vendorUser1 = await prisma.user.create({
    data: {
      email: 'mamaput@fulafia.edu.ng',
      name: 'Mama Put Delights',
      password: hashedPassword,
      role: 'VENDOR',
      avatarUrl: 'https://placehold.co/100x100.png',
    },
  })

  const vendorUser2 = await prisma.user.create({
    data: {
      email: 'juicebar@fulafia.edu.ng',
      name: 'Juice & Smoothie Bar',
      password: hashedPassword,
      role: 'VENDOR',
      avatarUrl: 'https://placehold.co/100x100.png',
    },
  })
  
  const vendorUser3 = await prisma.user.create({
    data: {
      email: 'campusgrills@fulafia.edu.ng',
      name: 'Campus Grills',
      password: hashedPassword,
      role: 'VENDOR',
      avatarUrl: 'https://placehold.co/100x100.png',
    },
  })

  // --- Create Vendors ---
  const vendor1 = await prisma.vendor.create({
    data: {
      userId: vendorUser1.id,
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
      description: 'Serving the best home-style Nigerian snacks on campus. From puff-puff to meat pie, we have it all!',
      logoUrl: 'https://placehold.co/400x400.png',
      campusLocation: 'Faculty of Arts Complex',
      isApproved: true,
<<<<<<< HEAD
      ownerId: vendorUser1.id,
    },
  })

  const vendor2 = await prisma.vendor.upsert({
    where: { ownerId: vendorUser2.id },
    update: {},
    create: {
      name: 'Juice & Smoothie Bar',
=======
    },
  })

  const vendor2 = await prisma.vendor.create({
    data: {
      userId: vendorUser2.id,
>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c
      description: 'Freshly squeezed juices and healthy smoothies to keep you refreshed and energized throughout the day.',
      logoUrl: 'https://placehold.co/400x400.png',
      campusLocation: 'University Library Entrance',
      isApproved: true,
<<<<<<< HEAD
      ownerId: vendorUser2.id,
    },
  })
  
  // Create Snacks
  const snack1 = await prisma.snack.upsert({
    where: { name: 'Meat Pie' },
    update: {},
    create: {
        name: 'Meat Pie',
        description: 'A delicious pastry filled with minced meat and vegetables.',
        price: 300,
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Pastries',
        vendorId: vendor1.id,
    }
  });

  const snack2 = await prisma.snack.upsert({
    where: { name: 'Puff-Puff (4pcs)' },
    update: {},
    create: {
        name: 'Puff-Puff (4pcs)',
        description: 'Sweet, fluffy, deep-fried dough balls. A classic Nigerian treat.',
        price: 200,
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Pastries',
        vendorId: vendor1.id,
    }
  });

  const snack3 = await prisma.snack.upsert({
    where: { name: 'Pineapple & Ginger Juice' },
    update: {},
    create: {
        name: 'Pineapple & Ginger Juice',
        description: 'A refreshing blend of sweet pineapple and spicy ginger.',
        price: 500,
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Drinks',
        vendorId: vendor2.id,
    }
  });

  const snack4 = await prisma.snack.upsert({
    where: { name: 'Samosa' },
    update: {},
    create: {
        name: 'Samosa',
        description: 'Crispy pastry filled with spiced potatoes and peas.',
        price: 250,
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Small Chops',
        vendorId: vendor1.id,
    }
  });

  // Create Reviews
  await prisma.review.createMany({
    data: [
      { rating: 5, comment: 'Absolutely delicious! Best meat pie on campus.', snackId: snack1.id, userId: customer1.id },
      { rating: 4, comment: 'Very tasty, but could be a bit bigger for the price.', snackId: snack1.id, userId: customer2.id },
      { rating: 5, comment: 'The puff-puff is always fresh and fluffy.', snackId: snack2.id, userId: customer1.id },
    ],
    skipDuplicates: true,
  });

  // Create Orders
  const order1 = await prisma.order.create({
    data: {
      userId: customer1.id,
      total: 1100,
      status: 'COMPLETED',
      items: {
        create: [
          { snackId: snack1.id, quantity: 2, price: snack1.price },
          { snackId: snack3.id, quantity: 1, price: snack3.price },
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      userId: customer2.id,
      total: 700,
      status: 'PREPARING',
      items: {
        create: [
          { snackId: snack2.id, quantity: 1, price: snack2.price },
          { snackId: snack4.id, quantity: 2, price: snack4.price },
        ]
      }
    }
  });
=======
    },
  })
  
  const vendor3 = await prisma.vendor.create({
    data: {
        userId: vendorUser3.id,
        description: 'Hot and spicy grilled chicken, beef, and fish. The perfect treat after a long day of lectures.',
        logoUrl: 'https://placehold.co/400x400.png',
        campusLocation: 'Student Union Building (SUB)',
        isApproved: false,
    }
  })


  // --- Create Snacks ---
  const snack1 = await prisma.snack.create({
    data: {
      name: 'Meat Pie',
      description: 'A delicious pastry filled with minced meat and vegetables.',
      price: 300,
      imageUrl: 'https://placehold.co/600x400.png',
      category: 'Pastries',
      vendorId: vendor1.id,
    },
  })

  const snack2 = await prisma.snack.create({
    data: {
      name: 'Puff-Puff (4pcs)',
      description: 'Sweet, fluffy, deep-fried dough balls. A classic Nigerian treat.',
      price: 200,
      imageUrl: 'https://placehold.co/600x400.png',
      category: 'Pastries',
      vendorId: vendor1.id,
    },
  })
  
  const snack3 = await prisma.snack.create({
    data: {
      name: 'Pineapple & Ginger Juice',
      description: 'A refreshing blend of sweet pineapple and spicy ginger.',
      price: 500,
      imageUrl: 'https://placehold.co/600x400.png',
      category: 'Drinks',
      vendorId: vendor2.id,
    },
  })
  
  const snack4 = await prisma.snack.create({
    data: {
      name: 'Grilled Chicken Lap',
      description: 'Juicy and tender chicken lap grilled to perfection with our secret spices.',
      price: 1200,
      imageUrl: 'https://placehold.co/600x400.png',
      category: 'Grills',
      vendorId: vendor3.id,
    },
  })
  
  // Create more snacks for pagination
   for (let i = 0; i < 10; i++) {
    await prisma.snack.create({
      data: {
        name: `Samosa Pack #${i + 1}`,
        description: 'Crispy pastry filled with spiced potatoes and peas.',
        price: 250 + i * 10,
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Small Chops',
        vendorId: vendor1.id,
      },
    });
    await prisma.snack.create({
      data: {
        name: `Watermelon Juice #${i + 1}`,
        description: 'Pure, refreshing, and hydrating watermelon juice.',
        price: 500 + i * 10,
        imageUrl: 'https://placehold.co/600x400.png',
        category: 'Drinks',
        vendorId: vendor2.id,
      },
    });
  }

  // --- Create Reviews ---
  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Absolutely delicious! Best meat pie on campus.',
      userId: customer1.id,
      snackId: snack1.id,
    },
  })

  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Very tasty, but could be a bit bigger for the price.',
      userId: customer2.id,
      snackId: snack1.id,
    },
  })
  
  await prisma.review.create({
    data: {
        rating: 5,
        comment: 'So refreshing and zesty!',
        userId: customer1.id,
        snackId: snack3.id,
    }
  })

  // --- Create Orders ---
  const order1 = await prisma.order.create({
    data: {
        userId: customer1.id,
        status: 'Completed',
        total: (snack1.price * 2) + snack3.price,
        items: {
            create: [
                { snackId: snack1.id, quantity: 2, price: snack1.price },
                { snackId: snack3.id, quantity: 1, price: snack3.price },
            ]
        }
    }
  })
  
  const order2 = await prisma.order.create({
    data: {
        userId: customer1.id,
        status: 'Preparing',
        total: snack2.price * 3,
        items: {
            create: [
                { snackId: snack2.id, quantity: 3, price: snack2.price },
            ]
        }
    }
  })
  
  const order3 = await prisma.order.create({
    data: {
        userId: customer2.id,
        status: 'Ready for Pickup',
        total: snack4.price,
        items: {
            create: [
                { snackId: snack4.id, quantity: 1, price: snack4.price },
            ]
        }
    }
  })

>>>>>>> e541f2755643cbd1fd5931961682235fd67a180c

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
