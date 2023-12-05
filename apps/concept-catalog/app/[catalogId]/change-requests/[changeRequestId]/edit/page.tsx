import { getOrganization, getConcept, getChangeRequest } from '@catalog-frontend/data-access';
import { Organization, Concept, ChangeRequest } from '@catalog-frontend/types';
import {
  authOptions,
  hasOrganizationReadPermission,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import jsonpatch from 'fast-json-patch';
import ChangeRequestEditPageClient from './change-request-edit-page-client';
import { RedirectType, redirect } from 'next/navigation';

const ChangeRequestEditPage = async ({ params }) => {
  const { catalogId, changeRequestId } = params;
  if (!validOrganizationNumber(catalogId) || !validUUID(changeRequestId)) {
    redirect(`/not-found`, RedirectType.replace);
  }

  const session = await getServerSession(authOptions);
  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?callbackUrl=/${catalogId}/change-requests/${changeRequestId}/edit`,
      },
    };
  }

  const hasPermission = session && hasOrganizationReadPermission(session?.accessToken, catalogId);
  if (!hasPermission) {
    return {
      redirect: {
        permanent: false,
        destination: `/${catalogId}/no-access`,
      },
    };
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  let originalConcept: Concept = {
    id: null,
    ansvarligVirksomhet: { id: organization.organizationId },
    seOgså: [],
  };

  const changeRequest: ChangeRequest = await getChangeRequest(catalogId, changeRequestId, `${session.accessToken}`)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      throw error;
    });

  if (changeRequest.conceptId && validUUID(changeRequest.conceptId)) {
    originalConcept = await getConcept(changeRequest.conceptId, `${session.accessToken}`)
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        throw error;
      });
  }

  const changeRequestAsConcept: Concept = jsonpatch.applyPatch(
    jsonpatch.deepClone(originalConcept),
    jsonpatch.deepClone(changeRequest.operations),
    false,
  ).newDocument;
  const clientProps = {
    FDK_REGISTRATION_BASE_URI: process.env.FDK_REGISTRATION_BASE_URI,
    organization,
    changeRequest,
    changeRequestAsConcept,
    originalConcept,
  };
  return <ChangeRequestEditPageClient {...clientProps} />;
};

export default ChangeRequestEditPage;
