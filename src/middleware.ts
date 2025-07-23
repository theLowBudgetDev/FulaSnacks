
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
      // This part should be handled by the authorized callback below,
      // but as a safeguard, we can return early.
      return
    }

    const role = token.role as string;

    // Admin route protection
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    // Vendor route protection
    // Admins should also be able to access the vendor dashboard
    if (pathname.startsWith('/dashboard') && role !== 'VENDOR' && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        
        // Define all protected routes
        const protectedRoutes = [
          '/admin',
          '/dashboard',
          '/profile',
          '/orders',
          '/cart',
        ];

        // If the path is a protected route, a token must exist
        if (protectedRoutes.some(path => pathname.startsWith(path))) {
            return !!token;
        }

        // For all other routes, access is granted
        return true;
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
