import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({});

export const config = {
  matcher: ["/((?!auth/signin|api|_next/static|_next/image|favicon.ico).*)"],
};
