import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  const hostname = (req.headers.get("host") || "").replace(
    ".localhost:3000",
    `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`,
  );

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;

  // rewrites for app pages
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    const session = await getToken({ req });
    if (!session && path !== "/signin") {
      return NextResponse.redirect(new URL("/signin", req.url));
    } else if (session && path == "/signin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.rewrite(
      new URL(`/app${path === "/" ? "" : path}`, req.url),
    );
  }

  // rewrites for app pages
  if (hostname == `api.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return NextResponse.rewrite(
      new URL(`/api${path === "/" ? "" : path}`, req.url),
    );
  }

  // rewrite root application to `/home` folder
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(new URL(`/home${path}`, req.url));
  }

  // rewrite everything else to `/[domain]/[path] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
