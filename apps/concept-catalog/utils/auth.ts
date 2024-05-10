import {
  getValidSession,
  hasOrganizationAdminPermission,
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import { RedirectType, redirect } from 'next/navigation';

type PageParams = {
  catalogId: string;
  conceptId?: string | undefined | null;
  changeRequestId?: string | undefined | null;
  conceptIdSearch?: string | undefined | null;
};
type PagePath = (params: PageParams) => string;
type Render = (
  props: { session: any; hasWritePermission: boolean; hasAdminPermission: boolean } & PageParams,
) => Promise<any>;

const withProtectedPage = (pagePath: PagePath, permissions: 'read' | 'write', render: Render) => {
  return async ({ params, searchParams }) => {
    const { catalogId, conceptId, changeRequestId } = params;
    const { concept: conceptIdSearch } = searchParams;

    if (!validOrganizationNumber(catalogId)) {
      redirect(`/notfound`, RedirectType.replace);
    }

    [conceptId, conceptIdSearch, changeRequestId].forEach((param) => {
      if (params[param] && !validUUID(params[param])) {
        return redirect(`/notfound`, RedirectType.replace);
      }
    });

    const session = await getValidSession({
      signInPath: '/auth/signin',
      callbackUrl: pagePath({ catalogId, conceptId, conceptIdSearch, changeRequestId }),
    });

    const hasReadPermission =
      session?.accessToken &&
      (hasOrganizationReadPermission(session?.accessToken, catalogId) || hasSystemAdminPermission(session.accessToken));
    if (!hasReadPermission) {
      redirect(`/${catalogId}/no-access`, RedirectType.replace);
    }

    const hasWritePermission = session?.accessToken && hasOrganizationWritePermission(session.accessToken, catalogId);
    if (!hasWritePermission && permissions === 'write') {
      redirect(`/${catalogId}/no-access`, RedirectType.replace);
    }

    const hasAdminPermission = session?.accessToken && hasOrganizationAdminPermission(session.accessToken, catalogId);

    return await render({
      catalogId,
      conceptId,
      changeRequestId,
      conceptIdSearch,
      session,
      hasWritePermission,
      hasAdminPermission,
    });
  };
};

export const withReadProtectedPage = (pagePath: PagePath, render: Render) =>
  withProtectedPage(pagePath, 'read', render);
export const withWriteProtectedPage = (pagePath: PagePath, render: Render) =>
  withProtectedPage(pagePath, 'write', render);
