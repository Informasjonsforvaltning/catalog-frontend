import {
  authOptions,
  hasOrganizationWritePermission,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { RedirectType, redirect } from 'next/navigation';

export async function EditPage({ params }) {
  const { catalogId, conceptId } = params;
  if (!(validOrganizationNumber(catalogId) && validUUID(conceptId))) {
    redirect(`/not-found`, RedirectType.replace);
  }

  const session = await getServerSession(authOptions);
  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    redirect(`/auth/signin?callbackUrl=/${catalogId}/${conceptId}`);
  }

  const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);
  if (!hasWritePermission) {
    redirect(`/${catalogId}/no-access`);
  }

  redirect(`${process.env.CONCEPT_CATALOG_GUI_BASE_URI}/${catalogId}/${conceptId}`);
}

export default EditPage;
