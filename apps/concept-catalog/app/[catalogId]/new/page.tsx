import { authOptions, hasOrganizationWritePermission, validOrganizationNumber } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { RedirectType, redirect } from 'next/navigation';

export const NewPage = async ({ params }) => {
  const { catalogId } = params;
  if (!validOrganizationNumber(catalogId)) {
    redirect(`/notfound`, RedirectType.replace);
  }

  const session = await getServerSession(authOptions);
  const hasWritePermission = session && hasOrganizationWritePermission(session.accessToken, catalogId);
  if (!hasWritePermission) {
    redirect(`/${catalogId}/no-access`, RedirectType.replace);
  }
  redirect(`${process.env.CONCEPT_CATALOG_GUI_BASE_URI}/${catalogId}/new`, RedirectType.push);
};

export default NewPage;
