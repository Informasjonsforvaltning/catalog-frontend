import {
  getValidSession,
  hasOrganizationAdminPermission,
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  redirectToSignIn,
  validOrganizationNumber,
  validUUID,
} from "@catalog-frontend/utils";
import { RedirectType, redirect } from "next/navigation";
import { Session } from "next-auth";
import { ReactNode } from "react";

type PageParams = {
  catalogId: string;
  serviceId?: string | undefined | null;
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
  return async ({ params }: { params: Promise<PageParams> }) => {
    const { catalogId, serviceId } = await params;

    if (!validOrganizationNumber(catalogId)) {
      redirect("/notfound", RedirectType.replace);
    }

    [serviceId].forEach((param) => {
      if (params[param] && !validUUID(params[param])) {
        return redirect("/notfound", RedirectType.replace);
      }
    });

    const session = await getValidSession();
    if (!session) {
      return redirectToSignIn(pagePath({ catalogId, serviceId }));
    }

    const hasReadPermission =
      session?.accessToken &&
      (hasOrganizationReadPermission(session?.accessToken, catalogId) ||
        hasSystemAdminPermission(session.accessToken));
    if (!hasReadPermission) {
      redirect(`/catalogs/${catalogId}/no-access`, RedirectType.replace);
    }

    const hasWritePermission =
      session?.accessToken &&
      hasOrganizationWritePermission(session.accessToken, catalogId);
    if (!hasWritePermission && permissions === "write") {
      redirect(`/catalogs/${catalogId}/no-access`, RedirectType.replace);
    }

    const hasAdminPermission =
      session?.accessToken &&
      hasOrganizationAdminPermission(session.accessToken, catalogId);

    return await render({
      catalogId,
      serviceId,
      session,
      hasWritePermission,
      hasAdminPermission,
    });
  };
};

export const withReadProtectedPage = (pagePath: PagePath, render: Render) =>
  withProtectedPage(pagePath, "read", render);
export const withWriteProtectedPage = (pagePath: PagePath, render: Render) =>
  withProtectedPage(pagePath, "write", render);
