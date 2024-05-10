import { getValidSession, hasOrganizationAdminPermission, validOrganizationNumber } from '@catalog-frontend/utils';
import { RedirectType, redirect } from 'next/navigation';

type PagePathProps = ({ catalogId }) => string;
type RenderProps = ({ catalogId, session }) => Promise<any>;

export const withProtectedPage = (pagePath: PagePathProps, render: RenderProps) => {
  return async ({ params }) => {
    const { catalogId } = params;
    if (!validOrganizationNumber(catalogId)) {
      redirect(`/notfound`, RedirectType.replace);
    }

    const session = await getValidSession({
      signInPath: '/auth/signin',
      callbackUrl: pagePath(catalogId),
    });

    const hasAdminPermission = session?.accessToken && hasOrganizationAdminPermission(session.accessToken, catalogId);
    if (!hasAdminPermission) {
      return redirect(`/catalogs/${catalogId}/no-access`);
    }

    return await render({ catalogId, session });
  };
};
