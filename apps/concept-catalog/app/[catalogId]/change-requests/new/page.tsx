import { getOrganization } from '@catalog-frontend/data-access';
import { Organization, Concept, ChangeRequestUpdateBody } from '@catalog-frontend/types';
import { hasOrganizationReadPermission, validOrganizationNumber } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import jsonpatch from 'fast-json-patch';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { RedirectType, redirect } from 'next/navigation';
import NewConceptSuggestionClient from './new-concept-suggestion-client';

const NewConceptSuggestion = async ({ params }) => {
  const FDK_REGISTRATION_BASE_URI = process.env.FDK_REGISTRATION_BASE_URI;
  const { catalogId } = params;

  const session = await getServerSession(authOptions);
  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    redirect(`/auth/signin?callbackUrl=/${catalogId}/change-requests/new`, RedirectType.replace);
  }

  const hasPermission = session && hasOrganizationReadPermission(session?.accessToken, catalogId);
  if (!hasPermission) {
    redirect(`/${catalogId}/no-access`, RedirectType.replace);
  }

  if (!validOrganizationNumber(catalogId)) {
    return { notFound: true };
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  const newChangeRequest: ChangeRequestUpdateBody = {
    conceptId: undefined,
    operations: [],
    title: '',
  };

  const emptyOriginalConcept: Concept = {
    id: '',
    ansvarligVirksomhet: { id: organization.organizationId },
    seOgså: [],
  };

  const changeRequestAsConcept = jsonpatch.applyPatch(
    jsonpatch.deepClone(emptyOriginalConcept),
    jsonpatch.deepClone(newChangeRequest.operations),
    false,
  ).newDocument;

  const clientProps = {
    FDK_REGISTRATION_BASE_URI,
    organization,
    changeRequest: newChangeRequest,
    changeRequestAsConcept,
    originalConcept: emptyOriginalConcept,
    showOriginal: false,
  };

  return <NewConceptSuggestionClient {...clientProps} />;
};

export default NewConceptSuggestion;
