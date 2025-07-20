// Sample data for the FulaSnacks application

export const sampleVendors = [
  {
    id: "v1",
    name: "Mama Put Delights",
    description: "Serving the best home-style Nigerian snacks on campus. From puff-puff to meat pie, we have it all!",
    logoUrl: "https://images.unsplash.com/photo-1606843046080-45bf7a23c39f?q=80&w=400&h=400&auto=format&fit=crop",
    location: "Faculty of Arts Complex",
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: "v2",
    name: "Juice & Smoothie Bar",
    description: "Freshly squeezed juices and healthy smoothies to keep you refreshed and energized throughout the day.",
    logoUrl: "https://images.unsplash.com/photo-1622597467836-f3e6707e1191?q=80&w=400&h=400&auto=format&fit=crop",
    location: "University Library Entrance",
    rating: 4.5,
    reviewCount: 87
  },
  {
    id: "v3",
    name: "Campus Grills",
    description: "Hot and spicy grilled chicken, beef, and fish. The perfect treat after a long day of lectures.",
    logoUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&h=400&auto=format&fit=crop",
    location: "Student Union Building (SUB)",
    rating: 4.7,
    reviewCount: 56
  }
];

export const sampleSnacks = [
  {
    id: "s1",
    name: "Meat Pie",
    description: "A delicious pastry filled with minced meat and vegetables.",
    price: 300,
    imageUrl: "https://images.unsplash.com/photo-1604478579007-7c86933934fd?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Pastries",
    vendorId: "v1",
    rating: 4.8,
    reviewCount: 42
  },
  {
    id: "s2",
    name: "Puff-Puff (4pcs)",
    description: "Sweet, fluffy, deep-fried dough balls. A classic Nigerian treat.",
    price: 200,
    imageUrl: "https://images.unsplash.com/photo-1630976244030-8c75066e9c88?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Pastries",
    vendorId: "v1",
    rating: 4.9,
    reviewCount: 38
  },
  {
    id: "s3",
    name: "Pineapple & Ginger Juice",
    description: "A refreshing blend of sweet pineapple and spicy ginger.",
    price: 500,
    imageUrl: "https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Drinks",
    vendorId: "v2",
    rating: 4.7,
    reviewCount: 29
  },
  {
    id: "s4",
    name: "Grilled Chicken Lap",
    description: "Juicy and tender chicken lap grilled to perfection with our secret spices.",
    price: 1200,
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=600&h=400&auto=format&fit=crop",
    category: "Grills",
    vendorId: "v3",
    rating: 4.6,
    reviewCount: 18
  }
];

export const sampleUsers = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@fulafia.edu.ng",
    role: "ADMIN",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "u2",
    name: "Alex Doe",
    email: "alex.doe@fulafia.edu.ng",
    role: "CUSTOMER",
    avatarUrl: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    id: "u3",
    name: "Jane Smith",
    email: "jane.smith@fulafia.edu.ng",
    role: "CUSTOMER",
    avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg"
  }
];

export const sampleOrders = [
  {
    id: "o1",
    userId: "u2",
    userName: "Alex Doe",
    status: "Completed",
    total: 1100,
    createdAt: "2023-07-15T10:30:00Z",
    items: [
      { snackId: "s1", name: "Meat Pie", quantity: 2, price: 300 },
      { snackId: "s3", name: "Pineapple & Ginger Juice", quantity: 1, price: 500 }
    ]
  },
  {
    id: "o2",
    userId: "u2",
    userName: "Alex Doe",
    status: "Preparing",
    total: 600,
    createdAt: "2023-07-16T14:45:00Z",
    items: [
      { snackId: "s2", name: "Puff-Puff (4pcs)", quantity: 3, price: 200 }
    ]
  },
  {
    id: "o3",
    userId: "u3",
    userName: "Jane Smith",
    status: "Ready for Pickup",
    total: 1200,
    createdAt: "2023-07-16T15:20:00Z",
    items: [
      { snackId: "s4", name: "Grilled Chicken Lap", quantity: 1, price: 1200 }
    ]
  }
];
