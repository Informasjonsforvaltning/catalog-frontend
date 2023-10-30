import { getChangeRequests, getOrganization, searchConceptsForCatalog } from '@catalog-frontend/data-access';
import { ChangeRequest, Concept, Organization, SearchConceptQuery } from '@catalog-frontend/types';
import { BreadcrumbType, Breadcrumbs, Button, PageBanner, Tag } from '@catalog-frontend/ui';
import {
  capitalizeFirstLetter,
  convertTimestampToDateAndTime,
  getTranslateText,
  hasOrganizationReadPermission,
  localization as loc,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import styles from './change-requests-page.module.css';
import { useRouter } from 'next/router';
import { Heading, Link } from '@digdir/design-system-react';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import { useCatalogDesign } from '../../../context/catalog-design';

export const ChangeRequestsPage = ({
  organization,
  changeRequests,
  conceptsWithChangeRequest,
  FDK_REGISTRATION_BASE_URI,
}) => {
  const pageSubtitle = organization?.name ?? '';
  const router = useRouter();

  const handleNewConceptSuggestionClick = () => {
    const catalogId = router.query.catalogId.toString();
    if (validOrganizationNumber(catalogId)) {
      router.push(`/${catalogId}/change-requests/new`);
    }
  };

  const catalogId = organization.organizationId;
  const breadcrumbList = [
    {
      href: `/${catalogId}`,
      text: loc.concept.concept,
    },
    {
      href: `/${catalogId}/change-requests`,
      text: loc.changeRequest.changeRequest,
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
      <div className='container'>
        <div className={styles.buttonsContainer}>
          <Button onClick={handleNewConceptSuggestionClick}>{loc.suggestionForNewConcept}</Button>
        </div>
        <Heading
          level={2}
          size='xsmall'
        >
          {loc.changeRequest.changeRequest}
        </Heading>
        {changeRequests.length > 0 ? (
          <div className={styles.listWrapper}>
            <ul className={styles.list}>
              {changeRequests.map(({ id, title, catalogId, conceptId, timeForProposal, proposedBy, status }) => (
                <li
                  key={id}
                  itemID={id}
                  className={styles.listItem}
                >
                  <div className={styles.listContent}>
                    <div>
                      <Link
                        href={
                          validOrganizationNumber(catalogId) &&
                          validUUID(id) &&
                          changeRequests.find(({ id: changeRequestId }) => changeRequestId === id)
                            ? `/${catalogId}/change-requests/${id}`
                            : '#'
                        }
                      >
                        <Heading
                          level={3}
                          size='xsmall'
                          className={styles.heading}
                        >
                          {title ||
                            (conceptId && conceptsWithChangeRequest
                              ? getTranslateText(
                                  conceptsWithChangeRequest?.hits?.find(
                                    (concept) => concept.originaltBegrep === conceptId,
                                  )?.anbefaltTerm?.navn,
                                )
                              : loc.suggestionForNewConcept)}
                        </Heading>
                      </Link>
                      <div className={styles.text}>
                        <p>{convertTimestampToDateAndTime(timeForProposal)}</p>
                        <p>
                          {proposedBy.name
                            .split(' ')
                            .map((namePart) => capitalizeFirstLetter(namePart))
                            .join(' ')}
                        </p>
                      </div>
                    </div>
                    {status && (
                      <div className={styles.status}>
                        <Tag>{status}</Tag>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={styles.emptyListMessage}>
            <p>{loc.changeRequest.noChangeRequestsFound}</p>
          </div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps({ req, res, params }) {
  const session: Session = await getServerSession(req, res, authOptions);
  const { catalogId } = params;

  if (!(session?.user && Date.now() < session?.accessTokenExpiresAt * 1000)) {
    return {
      redirect: {
        permanent: false,
        destination: `/auth/signin?callbackUrl=/${catalogId}/change-requests`,
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

  const changeRequests: ChangeRequest[] = await getChangeRequests(catalogId, `${session.accessToken}`)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      throw error;
    });

  const originalIds = changeRequests
    .map((cr) => cr.conceptId)
    .filter((conceptId) => conceptId !== null && conceptId !== undefined);

  const searchQuery: SearchConceptQuery = {
    query: '',
    pagination: {
      page: 0,
      size: originalIds.length,
    },
    fields: undefined,
    sort: undefined,
    filters: { originalId: { value: originalIds } },
  };

  const response = await searchConceptsForCatalog(catalogId, searchQuery, session?.accessToken);
  const conceptsWithChangeRequest: Concept[] = await response.json();
  const FDK_REGISTRATION_BASE_URI = process.env.FDK_REGISTRATION_BASE_URI;

  return {
    props: {
      organization,
      changeRequests,
      conceptsWithChangeRequest,
      FDK_REGISTRATION_BASE_URI,
    },
  };
}

export default ChangeRequestsPage;
