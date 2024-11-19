import { getConcept, getOrganization, searchChangeRequest } from '@catalog-frontend/data-access';
import { Organization, Concept, ChangeRequest } from '@catalog-frontend/types';
import { localization } from '@catalog-frontend/utils';
import jsonpatch from 'fast-json-patch';
import { RedirectType, redirect } from 'next/navigation';
import ChangeRequestOrNewClient from './change-request-or-new-client';
import { BreadcrumbType, Breadcrumbs, DetailHeading } from '@catalog-frontend/ui';
import { Banner } from '../../../../components/banner';
import style from '../change-requests-page.module.css';
import { Alert, Heading, Paragraph } from '@digdir/designsystemet-react';
import { withReadProtectedPage } from '../../../../utils/auth';

const ChangeRequestOrNew = withReadProtectedPage(
  ({ catalogId, conceptIdSearch }) =>
    `/${catalogId}/change-requests/new${conceptIdSearch ? `?conceptId=${conceptIdSearch}` : ''}`,
  async ({ catalogId, conceptIdSearch, session }) => {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());
    const baselineConcept: Concept = {
      id: null,
      ansvarligVirksomhet: { id: organization.organizationId },
      seOgså: [],
    };

    let originalConcept: Concept | undefined = undefined;

    if (conceptIdSearch) {
      originalConcept = await getConcept(`${conceptIdSearch}`, `${session.accessToken}`).then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          return originalConcept;
        } else throw new Error('Error when searching for original concept');
      });

        let existingChangeRequest: ChangeRequest | undefined = undefined;

        if (originalConcept?.originaltBegrep) {
            [existingChangeRequest] = await searchChangeRequest(
                catalogId,
                `${originalConcept?.originaltBegrep}`,
                session.accessToken,
                'OPEN',
            ).then((res) => res.json());
        }

      if (existingChangeRequest?.id && existingChangeRequest?.status === 'OPEN') {
        redirect(`/${catalogId}/change-requests/${existingChangeRequest.id}/edit`, RedirectType.replace);
      }
    }

    const pageSubtitle = organization?.name ?? organization.organizationId;

    const newChangeRequest: ChangeRequest = {
      id: null,
      conceptId: conceptIdSearch,
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
        text: conceptIdSearch ? localization.changeRequest.newChangeRequest : localization.suggestionForNewConcept,
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
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
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
                {originalConcept
                  ? localization.changeRequest.alert.editAlertInfo.heading
                  : localization.changeRequest.alert.newAlertInfo.heading}
              </Heading>
              <Paragraph>{localization.changeRequest.alert.newAlertInfo.paragraph}</Paragraph>
            </Alert>
          </div>
          <div className={style.topRow}>
            <DetailHeading
              headingTitle={
                <h1>
                  {conceptIdSearch ? localization.changeRequest.newChangeRequest : localization.suggestionForNewConcept}
                </h1>
              }
            />
          </div>
          <ChangeRequestOrNewClient {...clientProps} />
        </div>
      </>
    );
  },
);

export default ChangeRequestOrNew;
