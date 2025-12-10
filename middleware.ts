import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Seller routes
    if (path.startsWith('/seller') && token?.role !== 'SELLER' && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes including admin (has its own login)
        const publicPaths = ['/', '/auth', '/browse', '/product', '/api/auth', '/admin', '/pricing', '/tips', '/affiliate', '/info']
        const isPublicPath = publicPaths.some((path) =>
          req.nextUrl.pathname.startsWith(path)
        )

        if (isPublicPath) {
          return true
        }

        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/seller/:path*'],
}
