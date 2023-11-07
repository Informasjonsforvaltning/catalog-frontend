import { getOrganization } from '@catalog-frontend/data-access';
import { Organization, Concept, ChangeRequestUpdateBody, JsonPatchOperation } from '@catalog-frontend/types';
import { hasOrganizationReadPermission, validOrganizationNumber } from '@catalog-frontend/utils';
import { authOptions } from '../../api/auth/[...nextauth]';
import { Session, getServerSession } from 'next-auth';
import { ChangeRequestForm } from './[changeRequestId]/_change-request-form';
import jsonpatch from 'fast-json-patch';
import { useCreateChangeRequest } from '../../../hooks/change-requests';
import { localization as loc } from '@catalog-frontend/utils';
import { BreadcrumbType, Breadcrumbs, PageBanner } from '@catalog-frontend/ui';
import { useCatalogDesign } from '../../../context/catalog-design';

const NewConceptSuggestion = ({
  FDK_REGISTRATION_BASE_URI,
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
  showOriginal,
}) => {
  const catalogId = organization.organizationId;
  const pageSubtitle = organization?.name ?? organization.id;

  const changeRequestMutateHook = useCreateChangeRequest({ catalogId: catalogId });
  const submitHandler = (values: Concept, title: string) => {
    const changeRequestFromConcept: ChangeRequestUpdateBody = {
      conceptId: changeRequest.conceptId,
      operations: jsonpatch.compare(originalConcept, values) as JsonPatchOperation[],
      title: title,
    };
    changeRequestMutateHook.mutate(changeRequestFromConcept);
  };

  const breadcrumbList = [
    {
      href: `/${catalogId}`,
      text: loc.concept.concept,
    },
    {
      href: `/${catalogId}/change-requests`,
      text: loc.changeRequest.changeRequest,
    },
    {
      href: `/${catalogId}/change-requests/new`,
      text: loc.suggestionForNewConcept,
    },
  ] as BreadcrumbType[];

  const design = useCatalogDesign();

  return (
    <>
      <Breadcrumbs
        baseURI={FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <PageBanner
        title={loc.catalogType.concept}
        subtitle={pageSubtitle}
        fontColor={design?.fontColor}
        backgroundColor={design?.backgroundColor}
        logo={design?.hasLogo && `/api/catalog-admin/${catalogId}/design/logo`}
        logoDescription={design?.logoDescription}
      />
      <ChangeRequestForm
        changeRequest={changeRequest}
        changeRequestAsConcept={changeRequestAsConcept}
        originalConcept={originalConcept}
        showOriginal={showOriginal}
        submitHandler={submitHandler}
      />
    </>
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
