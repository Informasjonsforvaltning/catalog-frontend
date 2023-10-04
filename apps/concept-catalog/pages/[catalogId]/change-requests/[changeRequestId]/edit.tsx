import { getOrganization, getConcept } from '@catalog-frontend/data-access';
import { Organization, Concept, ChangeRequest } from '@catalog-frontend/types';
import { hasOrganizationReadPermission, validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { authOptions } from '../../../api/auth/[...nextauth]';
import { Session, getServerSession } from 'next-auth';
import { ChangeRequestPage } from './_change-request-form';
import jsonpatch from 'fast-json-patch';
import { useUpdateChangeRequest } from '../../../../hooks/change-requests';

const ChangeRequestEditPage = ({
  FDK_REGISTRATION_BASE_URI,
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
  showOriginal,
}) => {
  const changeRequestMutateHook = useUpdateChangeRequest({
    catalogId: organization,
    changeRequestId: changeRequest.id,
  });
  return (
    <ChangeRequestPage
      FDK_REGISTRATION_BASE_URI={FDK_REGISTRATION_BASE_URI}
      organization={organization}
      changeRequest={changeRequest}
      changeRequestAsConcept={changeRequestAsConcept}
      originalConcept={originalConcept}
      showOriginal={showOriginal}
      changeRequestMutateHook={changeRequestMutateHook}
    />
  );
};

export async function getServerSideProps({ req, res, params }) {
  const session: Session = await getServerSession(req, res, authOptions);
  const { catalogId, changeRequestId } = params;

  const hasPermission = session && hasOrganizationReadPermission(session?.accessToken, catalogId);

  if (!hasPermission) {
    return {
      redirect: {
        permanent: false,
        destination: `/${catalogId}/no-access`,
      },
    };
  }

  if (!validOrganizationNumber(catalogId) || !validUUID(changeRequestId)) {
    return { notFound: true };
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  let originalConcept: Concept = {
    id: null,
    ansvarligVirksomhet: { id: organization.organizationId },
    seOgså: [],
  };

  // TODO: Fetch change request from API
  const changeRequest: ChangeRequest = {
    id: null,
    catalogId: catalogId,
    conceptId: null,
    status: 'OPEN',
    operations: [],
  };

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

  return {
    props: {
      organization,
      changeRequest,
      changeRequestAsConcept,
      originalConcept,
      showOriginal: true,
    },
  };
}

export default ChangeRequestEditPage;
