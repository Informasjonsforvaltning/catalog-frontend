import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

import {
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  validateOidcUserSession,
  validInformationModelID,
  validOrganizationNumber,
} from "@catalog-frontend/utils";

export const config = {
  matcher: "/catalogs/:path*",
};

export const proxy = withAuth(
  async function middleware(req: NextRequestWithAuth) {
    const accessToken = req.nextauth.token?.access_token;

    const pathname = req.nextUrl.pathname;
    const parts = pathname.split("/");
    const catalogId = validOrganizationNumber(parts[2]) ? parts[2] : undefined;
    const informationModelId = validInformationModelID(parts[4])
      ? parts[4]
      : undefined;

    const writePermissionsRoutes = [
      `/catalogs/${catalogId}/information-models/${informationModelId}/edit`,
      `/catalogs/${catalogId}/information-models/new`,
    ];

    if (catalogId && !validOrganizationNumber(catalogId)) {
      return NextResponse.rewrite(
        new URL("/not-found", process.env.NEXTAUTH_URL),
      );
    }

    if (informationModelId && !validInformationModelID(informationModelId)) {
      return NextResponse.rewrite(
        new URL("/not-found", process.env.NEXTAUTH_URL),
      );
    }

    if ((await validateOidcUserSession(accessToken)) !== true) {
      return NextResponse.rewrite(
        new URL(
          `/auth/signin?callbackUrl=${req.nextUrl.pathname}`,
          process.env.NEXTAUTH_URL,
        ),
      );
    }

    if (
      accessToken &&
      catalogId &&
      !(
        hasOrganizationReadPermission(accessToken, catalogId) ||
        hasSystemAdminPermission(accessToken)
      )
    ) {
      return NextResponse.rewrite(
        new URL(`/catalogs/${catalogId}/no-access`, process.env.NEXTAUTH_URL),
      );
    }

    if (
      accessToken &&
      catalogId &&
      !hasOrganizationWritePermission(accessToken, catalogId) &&
      writePermissionsRoutes.includes(pathname)
    ) {
      return NextResponse.rewrite(
        new URL(`/catalogs/${catalogId}/no-access`, process.env.NEXTAUTH_URL),
      );
    }
  },
  {
    pages: {
      signIn: "/auth/signin",
      signOut: "/auth/signout",
    },
    callbacks: {
      authorized: ({ req, token }) => {
        if (!token || token.error === "RefreshAccessTokenError") {
          return false;
        }
        return true;
      },
    },
  },
);
