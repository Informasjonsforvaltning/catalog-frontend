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
  conceptId?: string | undefined | null;
  resultId?: string | undefined | null;
  changeRequestId?: string | undefined | null;
  conceptIdSearch?: string | undefined | null;
};
type SearchParams = {
  concept?: string;
  page?: string;
};
type PagePath = (params: PageParams) => string;
type Render = (
  props: {
    session: Session;
    hasWritePermission: boolean;
    hasAdminPermission: boolean;
    searchParams: SearchParams;
  } & PageParams,
) => Promise<ReactNode>;

const withProtectedPage = (
  pagePath: PagePath,
  permissions: "read" | "write" | "admin",
  render: Render,
) => {
  return async ({
    params,
    searchParams,
  }: {
    params: Promise<PageParams>;
    searchParams: Promise<SearchParams>;
  }) => {
    const { catalogId, conceptId, resultId, changeRequestId } = await params;
    const { concept: conceptIdSearch, ...restSearchParams } =
      await searchParams;

    if (!validOrganizationNumber(catalogId)) {
      redirect("/notfound", RedirectType.replace);
    }

    [conceptId, conceptIdSearch, changeRequestId].forEach((param) => {
      if (param && !validUUID(param)) {
        return redirect("/notfound", RedirectType.replace);
      }
    });

    const session = await getValidSession();
    if (!session) {
      return redirectToSignIn(
        pagePath({
          catalogId,
          conceptId,
          conceptIdSearch,
          changeRequestId,
        }),
      );
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
    if (!hasAdminPermission && permissions === "admin") {
      redirect(`/catalogs/${catalogId}/no-access`, RedirectType.replace);
    }

    return await render({
      catalogId,
      conceptId,
      resultId,
      changeRequestId,
      conceptIdSearch,
      searchParams: restSearchParams,
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
