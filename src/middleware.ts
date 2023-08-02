import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const path = req.nextUrl.pathname;

    const authenticated = await getToken({ req });

    const loginPage = path.startsWith("/login");
    const sensitiveRoutes = ["/dashboard"];
    const accessingSensitiveRoutes = sensitiveRoutes.some((route) =>
      path.startsWith(route)
    );
    if (loginPage) {
      if (authenticated) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }
    if (path === "/") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!authenticated && accessingSensitiveRoutes) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);
export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
