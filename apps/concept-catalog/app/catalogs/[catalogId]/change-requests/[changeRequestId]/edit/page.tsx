import { getChangeRequest, getConceptRevisions, getOrganization } from '@catalog-frontend/data-access';
import { ChangeRequest, Concept, Organization } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, DesignBanner, DetailHeading } from '@catalog-frontend/ui';
import { formatISO, conceptIsHigherVersion, localization, validUUID } from '@catalog-frontend/utils';
import { Alert, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import jsonpatch from 'fast-json-patch';
import NextLink from 'next/link';
import { withReadProtectedPage } from '../../../../../../utils/auth';
import styles from '../../change-requests-page.module.css';
import ChangeRequestEditPageClient from './change-request-edit-page-client';

const ChangeRequestEditPage = withReadProtectedPage(
  ({ catalogId, changeRequestId }) => `/catalogs/${catalogId}/change-requests/${changeRequestId}/edit`,
  async ({ catalogId, changeRequestId, session }) => {
    const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

    const baselineConcept: Concept = {
      id: null,
      ansvarligVirksomhet: { id: organization.organizationId },
      seOgså: [],
    };

    const changeRequest: ChangeRequest = await getChangeRequest(
      catalogId,
      `${changeRequestId}`,
      `${session.accessToken}`,
    )
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        throw error;
      });

    const originalConcept =
      changeRequest.conceptId && validUUID(changeRequest.conceptId)
        ? await getConceptRevisions(`${changeRequest.conceptId}`, `${session.accessToken}`).then((response) => {
            if (response.ok) {
              return response.json().then((revisions: Concept[]) => {
                return revisions.reduce(function (prev, current) {
                  return conceptIsHigherVersion(prev, current) ? prev : current;
                });
              });
            } else throw new Error('Error when searching for original concept');
          })
        : undefined;

    const changeRequestAsConcept: Concept = jsonpatch.applyPatch(
      jsonpatch.deepClone(originalConcept || baselineConcept),
      jsonpatch.deepClone(changeRequest.operations),
      false,
    ).newDocument;

    const breadcrumbList = [
      {
        href: `/catalogs/${catalogId}`,
        text: localization.concept.concept,
      },
      {
        href: `/catalogs/${catalogId}/change-requests`,
        text: localization.changeRequest.changeRequest,
      },
      {
        href: `/catalogs/${catalogId}/change-requests/${changeRequest.id}`,
        text: changeRequest.title,
      },
      {
        href: `/catalogs/${catalogId}/change-requests/${changeRequest.id}/edit`,
        text: localization.edit,
      },
    ] as BreadcrumbType[];

    const subtitle = `${localization.concept.created}: ${
      changeRequest?.timeForProposal &&
      formatISO(changeRequest?.timeForProposal, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } - ${localization.concept.createdBy}: ${changeRequest.proposedBy?.name}`;

    const headingTitle = originalConcept?.id ? (
      <h1>
        <NextLink
          href={`/catalogs/${catalogId}/change-requests/${originalConcept.id}`}
          passHref
          legacyBehavior
        >
          <Link>{changeRequest.title}</Link>
        </NextLink>
      </h1>
    ) : (
      <h1>{changeRequest.title}</h1>
    );

    const clientProps = {
      organization,
      changeRequest,
      changeRequestAsConcept,
      originalConcept,
    };

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          title={localization.catalogType.concept}
          catalogId={catalogId}
        />
        <div className={'formContainer'}>
          <div className={styles.topRow}>
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
              <Paragraph>{localization.changeRequest.alert.editAlertInfo.paragraph}</Paragraph>
            </Alert>
          </div>
          <div className={styles.topRow}>
            <DetailHeading
              headingTitle={headingTitle}
              subtitle={subtitle}
            />
          </div>
          <ChangeRequestEditPageClient {...clientProps} />
        </div>
      </>
    );
  },
);

export default ChangeRequestEditPage;
