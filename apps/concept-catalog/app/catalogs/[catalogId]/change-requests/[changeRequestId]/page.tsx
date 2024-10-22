import { getOrganization, getConcept, getChangeRequest, getConceptRevisions } from '@catalog-frontend/data-access';
import { Organization, Concept, ChangeRequest } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, DetailHeading } from '@catalog-frontend/ui';
import { validUUID, localization, formatISO, conceptIsHigherVersion } from '@catalog-frontend/utils';
import jsonpatch from 'fast-json-patch';
import sharedStyle from '../change-requests-page.module.css';
import { Banner } from '../../../../../components/banner';
import { Alert, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import NextLink from 'next/link';
import ChangeRequestForm from '../../../../../components/change-request-form/change-request-form';
import { ButtonRow } from '../../../../../components/buttons/button-row';
import { withReadProtectedPage } from '../../../../../utils/auth';

const ChangeRequestDetailsPage = withReadProtectedPage(
  ({ catalogId, changeRequestId }) => `/${catalogId}/change-requests/${changeRequestId}`,
  async ({ catalogId, changeRequestId, session, hasWritePermission }) => {
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

    const pageSubtitle = organization?.name ?? organization.organizationId;

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
        href: `/${catalogId}/change-requests/${changeRequest.id}`,
        text: changeRequest.title,
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
          href={`/${catalogId}/${originalConcept.id}`}
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
      changeRequestAsConcept,
      originalConcept,
      readOnly: true,
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
        <div className={'formContainer'}>
          <div className={sharedStyle.topRow}>
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
          <div className={sharedStyle.topRow}>
            <DetailHeading
              headingTitle={headingTitle}
              subtitle={subtitle}
            />
            {changeRequest.id && changeRequest.status == 'OPEN' && (
              <ButtonRow
                catalogId={catalogId}
                changeRequestId={changeRequest.id}
                hasWritePermission={hasWritePermission}
              />
            )}
          </div>
          <ChangeRequestForm {...clientProps} />
        </div>
      </>
    );
  },
);

export default ChangeRequestDetailsPage;
