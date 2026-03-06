import {
  getValidSession,
  hasOrganizationAdminPermission,
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  redirectToSignIn,
  validOrganizationNumber,
  ValidSession,
  validUUID,
} from "@catalog-frontend/utils";
import { RedirectType, redirect } from "next/navigation";
import { ReactNode } from "react";

type PageParams = {
  catalogId: string;
  datasetId?: string | undefined | null;
};
type PagePath = (params: PageParams) => string;
type Render = (
  props: {
    session: ValidSession;
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
    const { catalogId, datasetId } = await params;

    if (!validOrganizationNumber(catalogId)) {
      redirect("/notfound", RedirectType.replace);
    }

    [datasetId].forEach((param) => {
      if (param && !validUUID(param)) {
        redirect("/notfound", RedirectType.replace);
      }
    });

    const session = await getValidSession();
    if (!session) {
      return redirectToSignIn(pagePath({ catalogId, datasetId }));
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
    if (!hasWritePermission && permissions === "write") {
      redirect(`/catalogs/${catalogId}/no-access`, RedirectType.replace);
    }

    const hasAdminPermission = hasOrganizationAdminPermission(
      session.accessToken,
      catalogId,
    );

    return await render({
      catalogId,
      datasetId,
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
