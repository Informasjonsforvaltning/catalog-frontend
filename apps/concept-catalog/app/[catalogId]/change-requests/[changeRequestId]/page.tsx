import { getOrganization, getConcept, getChangeRequest } from '@catalog-frontend/data-access';
import { Organization, Concept, ChangeRequest } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, DetailHeading } from '@catalog-frontend/ui';
import {
  authOptions,
  hasOrganizationReadPermission,
  validOrganizationNumber,
  validUUID,
  localization as loc,
  formatISO,
  hasOrganizationWritePermission,
} from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import jsonpatch from 'fast-json-patch';
import { RedirectType, redirect } from 'next/navigation';
import sharedStyle from '../change-requests-page.module.css';
import { Banner } from '../../../../components/banner';
import { Alert, Heading, Link, Paragraph } from '@digdir/design-system-react';
import NextLink from 'next/link';
import ChangeRequestForm from '../../../../components/change-request-form/change-request-form';
import { ButtonRow } from '../../../../components/buttons/button-row';

const ChangeRequestDetailsPage = async ({ params }) => {
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

  const hasReadPermission = session && hasOrganizationReadPermission(session?.accessToken, catalogId);
  if (!hasReadPermission) {
    return {
      redirect: {
        permanent: false,
        destination: `/${catalogId}/no-access`,
      },
    };
  }

  const hasWritePermission = session && hasOrganizationWritePermission(session?.accessToken, catalogId);

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

  const pageSubtitle = organization?.name ?? organization.organizationId;

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
      href: `/${catalogId}/change-requests/${changeRequest.id}`,
      text: changeRequest.title,
    },
  ] as BreadcrumbType[];

  const subtitle = `${loc.concept.created}: ${
    changeRequest?.timeForProposal &&
    formatISO(changeRequest?.timeForProposal, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } - ${loc.concept.createdBy}: ${changeRequest.proposedBy?.name}`;

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
    changeRequestAsConcept,
    originalConcept,
    readOnly: true,
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
      <div className={'formContainer'}>
        <div className={sharedStyle.topRow}>
          <Alert severity='info'>
            <Heading
              level={2}
              size='xsmall'
              spacing
            >
              {loc.changeRequest.alert.editAlertInfo.heading}
            </Heading>
            <Paragraph>{loc.changeRequest.alert.editAlertInfo.paragraph}</Paragraph>
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
};

export default ChangeRequestDetailsPage;
