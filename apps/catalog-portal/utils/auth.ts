import {
  getValidSession,
  hasOrganizationAdminPermission,
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  redirectToSignIn,
  validOrganizationNumber,
} from "@catalog-frontend/utils";
import { RedirectType, redirect } from "next/navigation";
import { Session } from "next-auth";
import type { ReactNode } from "react";

type PageParams = {
  catalogId: string;
};
type PagePath = (params: PageParams) => string;
type Render = (
  props: {
    session: Session;
    hasWritePermission: boolean;
    hasAdminPermission: boolean;
  } & PageParams,
) => Promise<ReactNode>;

const withProtectedPage = (
  pagePath: PagePath,
  permissions: "read" | "write",
  render: Render,
) => {
  return async ({ params }: { params: PageParams }) => {
    const { catalogId } = await params;

    if (catalogId && !validOrganizationNumber(catalogId)) {
      redirect("/no-access", RedirectType.replace);
    }

    const session = await getValidSession();
    if (!session) {
      return redirectToSignIn(pagePath({ catalogId }));
    }

    const hasReadPermission =
      hasOrganizationReadPermission(session?.accessToken, catalogId) ||
      hasSystemAdminPermission(session.accessToken);
    if (!hasReadPermission) {
      redirect("/no-access", RedirectType.replace);
    }

    const hasWritePermission = hasOrganizationWritePermission(
      session.accessToken,
      catalogId,
    );
    if (!hasWritePermission && permissions === "write") {
      redirect("/no-access", RedirectType.replace);
    }

    const hasAdminPermission = hasOrganizationAdminPermission(
      session.accessToken,
      catalogId,
    );

    return await render({
      catalogId,
      session,
      hasWritePermission,
      hasAdminPermission,
    });
  };
};

export const withReadProtectedPage = (pagePath: PagePath, render: Render) =>
  withProtectedPage(pagePath, "read", render);
