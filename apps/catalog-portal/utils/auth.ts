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

type PageParams = {
  catalogId: string;
};
type PagePath = (params: PageParams) => string;
type Render = (
  props: {
    session: any;
    hasWritePermission: boolean;
    hasAdminPermission: boolean;
  } & PageParams,
) => Promise<any>;

const withProtectedPage = (
  pagePath: PagePath,
  permissions: "read" | "write",
  render: Render,
) => {
  return async ({ params }: any) => {
    const { catalogId } = await params;

    if (catalogId && !validOrganizationNumber(catalogId)) {
      redirect("/no-access", RedirectType.replace);
    }

    const session = await getValidSession();
    if (!session) {
      return redirectToSignIn({
        callbackUrl: pagePath({ catalogId: catalogId }),
      });
    }

    const hasReadPermission =
      session?.accessToken &&
      (hasOrganizationReadPermission(session?.accessToken, catalogId) ||
        hasSystemAdminPermission(session.accessToken));
    if (!hasReadPermission) {
      redirect("/no-access", RedirectType.replace);
    }

    const hasWritePermission =
      session?.accessToken &&
      hasOrganizationWritePermission(session.accessToken, catalogId);
    if (!hasWritePermission && permissions === "write") {
      redirect("/no-access", RedirectType.replace);
    }

    const hasAdminPermission =
      session?.accessToken &&
      hasOrganizationAdminPermission(session.accessToken, catalogId);

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
