import { getOrganization, getConcept, getChangeRequest } from '@catalog-frontend/data-access';
import { Organization, Concept, ChangeRequest } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, DetailHeading } from '@catalog-frontend/ui';
import {
  authOptions,
  hasOrganizationReadPermission,
  validOrganizationNumber,
  validUUID,
  formatISO,
  localization,
} from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import jsonpatch from 'fast-json-patch';
import ChangeRequestEditPageClient from './change-request-edit-page-client';
import { RedirectType, redirect } from 'next/navigation';
import styles from '../../change-requests-page.module.css';
import { Banner } from '../../../../../components/banner';
import { Alert, Heading, Link, Paragraph } from '@digdir/design-system-react';
import NextLink from 'next/link';

const ChangeRequestEditPage = async ({ params }) => {
  const { catalogId, changeRequestId } = params;
  if (!validOrganizationNumber(catalogId) || !validUUID(changeRequestId)) {
    redirect(`/notfound`, RedirectType.replace);
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

  const baselineConcept: Concept = {
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

  const originalConcept =
    changeRequest.conceptId && validUUID(changeRequest.conceptId)
      ? await getConcept(changeRequest.conceptId, `${session.accessToken}`)
          .then((response) => {
            return response.json();
          })
          .catch((error) => {
            throw error;
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
    {
      href: `/${catalogId}/change-requests/${changeRequest.id}/edit`,
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

  const headingTitle = changeRequest.conceptId ? (
    <h1>
      <NextLink
        href={`/${catalogId}/${changeRequest.conceptId}`}
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
        baseURI={process.env.FDK_REGISTRATION_BASE_URI}
        breadcrumbList={breadcrumbList}
      />
      <Banner
        title={localization.catalogType.concept}
        subtitle={pageSubtitle}
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
};

export default ChangeRequestEditPage;
