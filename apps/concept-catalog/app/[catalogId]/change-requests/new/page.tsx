import { getConcept, getOrganization, searchChangeRequest } from '@catalog-frontend/data-access';
import { Organization, Concept, ChangeRequest } from '@catalog-frontend/types';
import {
  authOptions,
  hasOrganizationReadPermission,
  validOrganizationNumber,
  localization,
  validUUID,
  validateSession,
} from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import jsonpatch from 'fast-json-patch';
import { RedirectType, redirect } from 'next/navigation';
import ChangeRequestOrNewClient from './change-request-or-new-client';
import { BreadcrumbType, Breadcrumbs, DetailHeading } from '@catalog-frontend/ui';
import { Banner } from '../../../../components/banner';
import style from '../change-requests-page.module.css';
import { Alert, Heading, Paragraph } from '@digdir/design-system-react';

const ChangeRequestOrNew = async ({ params, searchParams }) => {
  const { catalogId } = params;
  const { concept: conceptId } = searchParams;

  const session = await getServerSession(authOptions);
  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    const callbackUrl = conceptId
      ? `/auth/signin?callbackUrl=/${catalogId}/change-requests/new?concept=${conceptId}`
      : `/auth/signin?callbackUrl=/${catalogId}/change-requests/new`;
    redirect(callbackUrl, RedirectType.replace);
  }

  const hasPermission = session && hasOrganizationReadPermission(session?.accessToken, catalogId);
  if (!hasPermission) {
    redirect(`/${catalogId}/no-access`, RedirectType.replace);
  }

  if (!validOrganizationNumber(catalogId)) {
    redirect(`/notfound`, RedirectType.replace);
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  if (conceptId && !validUUID(conceptId)) {
    redirect(`/notfound`, RedirectType.replace);
  }

  const baselineConcept: Concept = {
    id: null,
    ansvarligVirksomhet: { id: organization.organizationId },
    seOgså: [],
  };

  let originalConcept: Concept | undefined = undefined;

  if (conceptId) {
    const session = await getServerSession(authOptions);
    await validateSession(session);

    originalConcept = await getConcept(conceptId, `${session.accessToken}`).then((response) => {
      if (response.ok) {
        return response.json();
      } else if (response.status === 404) {
        return originalConcept;
      } else throw new Error('Error when searching for original concept');
    });

    const [existingChangeRequest]: [ChangeRequest] = await searchChangeRequest(
      catalogId,
      conceptId,
      session.accessToken,
      'OPEN',
    ).then((res) => res.json());

    if (existingChangeRequest?.id && existingChangeRequest?.status === 'OPEN') {
      redirect(`/${catalogId}/change-requests/${existingChangeRequest.id}/edit`, RedirectType.replace);
    }
  }

  const pageSubtitle = organization?.name ?? organization.organizationId;

  const newChangeRequest: ChangeRequest = {
    id: null,
    conceptId: conceptId || null,
    operations: [],
    title: '',
    catalogId: catalogId,
    status: 'OPEN',
  };

  const changeRequestAsConcept = jsonpatch.applyPatch(
    jsonpatch.deepClone(originalConcept || baselineConcept),
    jsonpatch.deepClone(newChangeRequest.operations),
    false,
  ).newDocument;

  const breadcrumbList = [
    {
      href: `/${catalogId}`,
      text: localization.concept.concept,
    },
    {
      href: `/${catalogId}/change-requests`,
      text: localization.changeRequest.changeRequest,
    },
    {
      href: `/${catalogId}/change-requests/new`,
      text: conceptId ? localization.changeRequest.newChangeRequest : localization.suggestionForNewConcept,
    },
  ] as BreadcrumbType[];

  const clientProps = {
    organization,
    changeRequestAsConcept,
    originalConcept,
  };

  return (
    <>
      <Breadcrumbs
        baseURI={process.env.FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <Banner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
        catalogId={catalogId}
      />
      <div className='formContainer'>
        <div className={style.topRow}>
          <Alert severity='info'>
            <Heading
              level={2}
              size='xsmall'
              spacing
            >
              {localization.changeRequest.alert.newAlertInfo.heading}
            </Heading>
            <Paragraph>{localization.changeRequest.alert.newAlertInfo.paragraph}</Paragraph>
          </Alert>
        </div>
        <div className={style.topRow}>
          <DetailHeading
            headingTitle={
              <h1>{conceptId ? localization.changeRequest.newChangeRequest : localization.suggestionForNewConcept}</h1>
            }
          />
        </div>
        <ChangeRequestOrNewClient {...clientProps} />
      </div>
    </>
  );
};

export default ChangeRequestOrNew;
