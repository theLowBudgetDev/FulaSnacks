# FulaSnacks - Campus Food Delivery Platform

FulaSnacks is a web application that connects students at Federal University Lafia with campus food vendors. Students can browse snacks, place orders, and have them delivered or picked up, while vendors can manage their products and orders through a dedicated dashboard.

## Features

### For Customers
- Browse snacks from various campus vendors
- Add items to cart and place orders
- Track order status
- Save favorite snacks
- Leave reviews for purchased items

### For Vendors
- Manage product listings
- Process incoming orders
- Update order status
- View sales analytics
- Customize vendor profile

### For Admins
- Approve new vendors
- Manage users and vendors
- View platform analytics
- Configure platform settings

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite (can be migrated to PostgreSQL for production)
- **Authentication**: NextAuth.js
- **UI Components**: Shadcn UI

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/fulasnacks.git
cd fulasnacks
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Initialize the database
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Accounts

- **Admin**: admin@fulafia.edu.ng / password123
- **Vendor**: mamaput@fulafia.edu.ng / password123
- **Customer**: alex.doe@fulafia.edu.ng / password123

## License

This project is licensed under the MIT License - see the LICENSE file for details.
