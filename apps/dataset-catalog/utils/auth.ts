import {
  getValidSession,
  hasOrganizationAdminPermission,
  hasOrganizationReadPermission,
  hasOrganizationWritePermission,
  hasSystemAdminPermission,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher';
import { RedirectType, redirect } from 'next/navigation';

type PageParams = {
  catalogId: string;
  datasetId?: string | undefined | null;
};
type PagePath = (params: PageParams) => string;
type Render = (
  props: { session: any; hasWritePermission: boolean; hasAdminPermission: boolean } & PageParams,
) => Promise<any>;

const withProtectedPage = (pagePath: PagePath, permissions: 'read' | 'write', render: Render) => {
  return async ({ params }: Params) => {
    const { catalogId, datasetId } = params;

    if (!validOrganizationNumber(catalogId)) {
      redirect(`/notfound`, RedirectType.replace);
    }

    [datasetId].forEach((param) => {
      if (params[param] && !validUUID(params[param])) {
        return redirect(`/notfound`, RedirectType.replace);
      }
    });

    const session = await getValidSession({
      callbackUrl: pagePath({ catalogId, datasetId }),
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
      datasetId,
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
