import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";


export async function middleware(request: NextRequest) {
     const session = await getServerSession(authOptions)
     const url = request.nextUrl;

     if (session && (url.pathname.startsWith('/sign-in') ||
          url.pathname.startsWith('/sign-up') ||
          url.pathname === '/')) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
     }

     if (!session && (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/p2p') || url.pathname.startsWith('/transactions') || url.pathname.startsWith('/transfer'))
     ) {
          return NextResponse.redirect(new URL('/sign-in', request.url));
     }

     return NextResponse.next();
}

export const config = {
     matcher: [
          '/sign-in',
          '/sign-up',
          '/',
          '/dashboard/:path*',
          '/p2p/:path*',
          '/transfer/:path*',
          '/transactions/:path*',
     ]
};