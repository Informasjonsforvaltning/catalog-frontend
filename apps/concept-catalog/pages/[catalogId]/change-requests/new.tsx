import { getOrganization } from '@catalog-frontend/data-access';
import { Organization, Concept, ChangeRequestUpdateBody, JsonPatchOperation } from '@catalog-frontend/types';
import { hasOrganizationReadPermission, validOrganizationNumber } from '@catalog-frontend/utils';
import { authOptions } from '../../api/auth/[...nextauth]';
import { Session, getServerSession } from 'next-auth';
import { ChangeRequestForm } from './[changeRequestId]/_change-request-form';
import jsonpatch from 'fast-json-patch';
import { useCreateChangeRequest } from '../../../hooks/change-requests';

const NewConceptSuggestion = ({
  FDK_REGISTRATION_BASE_URI,
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
  showOriginal,
}) => {
  const changeRequestMutateHook = useCreateChangeRequest({ catalogId: organization.organizationId });

  const submitHandler = (values: Concept) => {
    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: changeRequest.conceptId,
      operations: jsonpatch.compare(originalConcept, values) as JsonPatchOperation[],
      title: '',
    };
    changeRequestMutateHook.mutate(changeRequestFromConcept);
  };

  return (
    <ChangeRequestForm
      FDK_REGISTRATION_BASE_URI={FDK_REGISTRATION_BASE_URI}
      organization={organization}
      changeRequest={changeRequest}
      changeRequestAsConcept={changeRequestAsConcept}
      originalConcept={originalConcept}
      showOriginal={showOriginal}
      submitHandler={submitHandler}
    />
  );
};

export async function getServerSideProps({ req, res, params }) {
  const FDK_REGISTRATION_BASE_URI = process.env.FDK_REGISTRATION_BASE_URI;
  const { catalogId } = params;

  const session: Session = await getServerSession(req, res, authOptions);
  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?callbackUrl=/${catalogId}/change-requests/new`,
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

  if (!validOrganizationNumber(catalogId)) {
    return { notFound: true };
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  const newChangeRequest: ChangeRequestUpdateBody = {
    conceptId: null,
    operations: [],
    title: '',
  };

  const emptyOriginalConcept: Concept = {
    id: null,
    ansvarligVirksomhet: { id: organization.organizationId },
    seOgså: [],
  };

  const changeRequestAsConcept = jsonpatch.applyPatch(
    jsonpatch.deepClone(emptyOriginalConcept),
    jsonpatch.deepClone(newChangeRequest.operations),
    false,
  ).newDocument;

  return {
    props: {
      organization,
      changeRequest: newChangeRequest,
      changeRequestAsConcept,
      originalConcept: emptyOriginalConcept,
      showOriginal: false,
      FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default NewConceptSuggestion;
