
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth
    const { pathname } = req.nextUrl

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')

    if (isAuthPage) {
        if (token) {
            return NextResponse.redirect(new URL('/', req.url))
        }
        return null
    }

    if (!token) {
      return
    }

    const role = token.role as string;

    // Admin route protection
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Vendor route protection
    if (pathname.startsWith('/dashboard') && role !== 'VENDOR' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/orders') || pathname.startsWith('/cart')) {
            return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile',
    '/orders',
    '/cart',
  ],
}
