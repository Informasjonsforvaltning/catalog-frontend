import { getOrganization } from '@catalog-frontend/data-access';
import { Organization, Concept, ChangeRequest } from '@catalog-frontend/types';
import {
  authOptions,
  hasOrganizationReadPermission,
  validOrganizationNumber,
  localization as loc,
} from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import jsonpatch from 'fast-json-patch';
import { RedirectType, redirect } from 'next/navigation';
import NewConceptSuggestionClient from './new-concept-suggestion-client';
import { BreadcrumbType, Breadcrumbs, DetailHeading } from '@catalog-frontend/ui';
import { Banner } from '../../../../components/banner';
import style from '../change-requests-page.module.css';

const NewConceptSuggestion = async ({ params }) => {
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
    redirect(`/not-found`, RedirectType.replace);
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
  const pageSubtitle = organization?.name ?? organization.organizationId;

  const newChangeRequest: ChangeRequest = {
    id: null,
    conceptId: null,
    operations: [],
    title: '',
    catalogId: catalogId,
    status: 'OPEN',
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

  const clientProps = {
    organization,
    changeRequestAsConcept,
    originalConcept: emptyOriginalConcept,
  };

  return (
    <>
      <Breadcrumbs
        baseURI={process.env.FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <Banner
        title={loc.catalogType.concept}
        subtitle={pageSubtitle}
        catalogId={catalogId}
      />
      <div className='formContainer'>
        <div className={style.topRow}>
          <DetailHeading headingTitle={<h1>{loc.suggestionForNewConcept}</h1>} />
        </div>
        <NewConceptSuggestionClient {...clientProps} />
      </div>
    </>
  );
};

export default NewConceptSuggestion;
