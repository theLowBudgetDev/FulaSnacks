import type { Snack, Vendor, Order } from './types';

export const vendors: Vendor[] = [
  {
    id: 'vendor-1',
    name: 'Mama Put Delights',
    description: 'Serving the best home-style Nigerian snacks on campus. From puff-puff to meat pie, we have it all!',
    logoUrl: 'https://placehold.co/400x400.png',
    campusLocation: 'Faculty of Arts Complex',
  },
  {
    id: 'vendor-2',
    name: 'Juice & Smoothie Bar',
    description: 'Freshly squeezed juices and healthy smoothies to keep you refreshed and energized throughout the day.',
    logoUrl: 'https://placehold.co/400x400.png',
    campusLocation: 'University Library Entrance',
  },
  {
    id: 'vendor-3',
    name: 'Campus Grills',
    description: 'Hot and spicy grilled chicken, beef, and fish. The perfect treat after a long day of lectures.',
    logoUrl: 'https://placehold.co/400x400.png',
    campusLocation: 'Student Union Building (SUB)',
  },
];

export const allSnacks: Snack[] = [
  {
    id: 'snack-1',
    name: 'Meat Pie',
    description: 'A delicious pastry filled with minced meat and vegetables.',
    price: 300,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-1',
    category: 'Pastries',
  },
  {
    id: 'snack-2',
    name: 'Puff-Puff (4pcs)',
    description: 'Sweet, fluffy, deep-fried dough balls. A classic Nigerian treat.',
    price: 200,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-1',
    category: 'Pastries',
  },
  {
    id: 'snack-3',
    name: 'Samosa',
    description: 'Crispy pastry filled with spiced potatoes and peas.',
    price: 250,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-1',
    category: 'Small Chops',
  },
  {
    id: 'snack-4',
    name: 'Doughnut',
    description: 'A soft, sweet, ring-shaped fried dough.',
    price: 200,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-1',
    category: 'Pastries',
  },
  {
    id: 'snack-5',
    name: 'Pineapple & Ginger Juice',
    description: 'A refreshing blend of sweet pineapple and spicy ginger.',
    price: 500,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-2',
    category: 'Drinks',
  },
  {
    id: 'snack-6',
    name: 'Mango Smoothie',
    description: 'A creamy and delicious smoothie made with fresh mangoes.',
    price: 700,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-2',
    category: 'Drinks',
  },
  {
    id: 'snack-7',
    name: 'Zobo Drink',
    description: 'A tangy and sweet hibiscus flower drink.',
    price: 300,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-2',
    category: 'Drinks',
  },
  {
    id: 'snack-8',
    name: 'Grilled Chicken Lap',
    description: 'Juicy and tender chicken lap grilled to perfection with our secret spices.',
    price: 1200,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-3',
    category: 'Grills',
  },
  {
    id: 'snack-9',
    name: 'Spicy Beef Kebab',
    description: 'Cubes of beef marinated in a spicy sauce and grilled on a skewer.',
    price: 800,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-3',
    category: 'Grills',
  },
  {
    id: 'snack-10',
    name: 'Sausage Roll',
    description: 'A savory pastry with a seasoned sausage filling.',
    price: 250,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-1',
    category: 'Pastries',
  },
  {
    id: 'snack-11',
    name: 'Watermelon Juice',
    description: 'Pure, refreshing, and hydrating watermelon juice.',
    price: 500,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-2',
    category: 'Drinks',
  },
  {
    id: 'snack-12',
    name: 'Grilled Fish',
    description: 'Whole tilapia fish marinated and grilled over charcoal.',
    price: 2500,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-3',
    category: 'Grills',
  },
   {
    id: 'snack-13',
    name: 'Coca-Cola',
    description: 'Classic Coca-Cola beverage.',
    price: 200,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-2',
    category: 'Beverages',
  },
  {
    id: 'snack-14',
    name: 'Fanta',
    description: 'Orange-flavored soda.',
    price: 200,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-2',
    category: 'Beverages',
  },
   {
    id: 'snack-15',
    name: 'Bottled Water',
    description: '50cl bottled spring water.',
    price: 100,
    imageUrl: 'https://placehold.co/600x400.png',
    vendorId: 'vendor-2',
    category: 'Beverages',
  },
];

export const featuredSnacks: Snack[] = allSnacks.slice(0, 4);

export const userOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user-123',
    items: [
      { snack: allSnacks[0], quantity: 2 },
      { snack: allSnacks[4], quantity: 1 },
    ],
    total: 1100,
    status: 'Completed',
    orderDate: '2023-10-26T10:00:00Z',
  },
  {
    id: 'ORD-002',
    userId: 'user-123',
    items: [{ snack: allSnacks[7], quantity: 1 }],
    total: 1200,
    status: 'Completed',
    orderDate: '2023-10-25T14:30:00Z',
  },
  {
    id: 'ORD-003',
    userId: 'user-123',
    items: [
        { snack: allSnacks[1], quantity: 1 },
        { snack: allSnacks[2], quantity: 2 }
    ],
    total: 700,
    status: 'Preparing',
    orderDate: new Date().toISOString(),
  },
  {
    id: 'ORD-004',
    userId: 'user-123',
    items: [
        { snack: allSnacks[8], quantity: 1 },
        { snack: allSnacks[11], quantity: 1 },
    ],
    total: 3300,
    status: 'Ready for Pickup',
    orderDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
  },
  {
    id: 'ORD-005',
    userId: 'user-123',
    items: [
        { snack: allSnacks[10], quantity: 3 },
    ],
    total: 1500,
    status: 'Cancelled',
    orderDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
  }
];
