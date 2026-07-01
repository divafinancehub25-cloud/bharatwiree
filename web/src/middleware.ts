import { NextResponse, type NextRequest } from "next/server";

/**
 * Protects /admin and the pipeline endpoint with a password (HTTP Basic Auth).
 * Set ADMIN_USER + ADMIN_PASSWORD in the environment.
 *  - In production: a password is REQUIRED (blocks access if unset — safety).
 *  - In development: if no password set, access is open for convenience.
 */
export function middleware(req: NextRequest) {
  const pass = process.env.ADMIN_PASSWORD;
  const isProd = process.env.NODE_ENV === "production";

  if (!pass) {
    if (isProd) {
      return new NextResponse(
        "Admin locked: set ADMIN_PASSWORD in your hosting environment.",
        { status: 503 },
      );
    }
    return NextResponse.next(); // dev convenience
  }

  const user = process.env.ADMIN_USER || "admin";
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const i = decoded.indexOf(":");
      const u = decoded.slice(0, i);
      const p = decoded.slice(i + 1);
      if (u === user && p === pass) return NextResponse.next();
    } catch {
      /* fall through */
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="BharatWire Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/pipeline/:path*"],
};
