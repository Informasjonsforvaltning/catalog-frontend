import {
  getValidSession,
  hasOrganizationAdminPermission,
  redirectToSignIn,
  validOrganizationNumber,
} from '@catalog-frontend/utils';
import { RedirectType, redirect } from 'next/navigation';

type PagePathProps = ({ catalogId }: any) => string;
type RenderProps = ({ catalogId, session }: any) => Promise<any>;

export const withProtectedPage = (pagePath: PagePathProps, render: RenderProps) => {
  return async ({ params }: any) => {
    const { catalogId } = await params;
    if (!validOrganizationNumber(catalogId)) {
      redirect(`/notfound`, RedirectType.replace);
    }

    const session = await getValidSession();
    if (!session) {
      return redirectToSignIn({
        callbackUrl: pagePath(catalogId),
      });
    }

    const hasAdminPermission = session?.accessToken && hasOrganizationAdminPermission(session.accessToken, catalogId);
    if (!hasAdminPermission) {
      return redirect(`/catalogs/${catalogId}/no-access`);
    }

    return await render({ catalogId, session });
  };
};
