import { getOrganization, getConcept, getChangeRequest } from '@catalog-frontend/data-access';
import {
  Organization,
  Concept,
  ChangeRequest,
  ChangeRequestUpdateBody,
  JsonPatchOperation,
} from '@catalog-frontend/types';
import { hasOrganizationReadPermission, validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { authOptions } from '../../../api/auth/[...nextauth]';
import { Session, getServerSession } from 'next-auth';
import { ChangeRequestForm } from './_change-request-form';
import jsonpatch from 'fast-json-patch';
import { useUpdateChangeRequest } from '../../../../hooks/change-requests';
import { useRouter } from 'next/router';

const ChangeRequestEditPage = ({
  FDK_REGISTRATION_BASE_URI,
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
  showOriginal,
}) => {
  const router = useRouter();
  const changeRequestMutateHook = useUpdateChangeRequest({
    catalogId: organization.organizationId,
    changeRequestId: changeRequest.id,
  });

  const submitHandler = (values: Concept, title: string) => {
    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: changeRequest.conceptId,
      operations: jsonpatch.compare(originalConcept, values) as JsonPatchOperation[],
      title: title,
    };

    changeRequestMutateHook.mutate(changeRequestFromConcept, {
      onSuccess: () => {
        router.reload();
      },
    });
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
  const { catalogId, changeRequestId } = params;
  if (!validOrganizationNumber(catalogId) || !validUUID(changeRequestId)) {
    return { notFound: true };
  }

  const session: Session = await getServerSession(req, res, authOptions);
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
