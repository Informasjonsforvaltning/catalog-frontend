import {
  getValidSession,
  hasOrganizationAdminPermission,
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  redirectToSignIn,
  validDataServiceID,
  validOrganizationNumber,
} from "@catalog-frontend/utils";
import { RedirectType, redirect } from "next/navigation";
import { Session } from "next-auth";
import { ReactNode } from "react";

type PageParams = {
  catalogId: string;
  dataServiceId?: string | undefined | null;
  resultId?: string | undefined | null;
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
  permissions: "read" | "write" | "admin",
  render: Render,
) => {
  return async ({ params }: any) => {
    const { catalogId, dataServiceId, resultId } = await params;

    if (!validOrganizationNumber(catalogId)) {
      redirect("/not-found", RedirectType.replace);
    }

    [dataServiceId].forEach((param) => {
      if (params[param] && !validDataServiceID(params[param])) {
        redirect("/not-found", RedirectType.replace);
      }
    });

    const session = await getValidSession();
    if (!session) {
      return redirectToSignIn(pagePath({ catalogId, dataServiceId }));
    }

    const hasReadPermission =
      hasOrganizationReadPermission(session.accessToken, catalogId) ||
      hasSystemAdminPermission(session.accessToken);
    if (!hasReadPermission) {
      redirect(`/catalogs/${catalogId}/no-access`, RedirectType.replace);
    }

    const hasWritePermission = hasOrganizationWritePermission(
      session.accessToken,
      catalogId,
    );
    if (
      !hasWritePermission &&
      (permissions === "write" || permissions === "admin")
    ) {
      redirect(`/catalogs/${catalogId}/no-access`, RedirectType.replace);
    }

    const hasAdminPermission = hasOrganizationAdminPermission(
      session.accessToken,
      catalogId,
    );
    if (!hasAdminPermission && permissions === "admin") {
      redirect(`/catalogs/${catalogId}/no-access`, RedirectType.replace);
    }

    return await render({
      catalogId,
      dataServiceId,
      resultId,
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
export const withAdminProtectedPage = (pagePath: PagePath, render: Render) =>
  withProtectedPage(pagePath, "admin", render);
