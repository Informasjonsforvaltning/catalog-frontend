import { getChangeRequests, getOrganization, searchConceptsForCatalog } from '@catalog-frontend/data-access';
import { ChangeRequest, Concept, Organization, SearchConceptQuery } from '@catalog-frontend/types';
import { Button, PageBanner, Tag } from '@catalog-frontend/ui';
import {
  capitalizeFirstLetter,
  convertTimestampToDateAndTime,
  getTranslateText,
  hasOrganizationReadPermission,
  localization as loc,
  validChangeRequestId,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import { getToken } from 'next-auth/jwt';
import styles from './change-requests-page.module.css';
import { useRouter } from 'next/router';
import { Heading } from '@digdir/design-system-react';
import { Session, getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';

export const ChangeRequestsPage = ({ organization, changeRequests, conceptsWithChangeRequest }) => {
  const pageSubtitle = organization?.name ?? '';
  const router = useRouter();

  const handleNewConceptSuggestion = () => {
    const catalogId = router.query.catalogId.toString();
    if (validOrganizationNumber(catalogId)) {
      router.push(`/${catalogId}/change-requests/new`);
    }
  };

  const handleListItemClick = ({ id: changeRequestId }) => {
    const catalogId = router.query.catalogId.toString();
    if (
      validOrganizationNumber(catalogId) &&
      validUUID(changeRequestId) &&
      validChangeRequestId(changeRequests, changeRequestId)
    ) {
      router.push(`/${catalogId}/change-requests/${changeRequestId}`);
    }
  };

  return (
    <>
      <PageBanner
        title={loc.catalogType.concept}
        subtitle={pageSubtitle}
      />
      <div className='container'>
        <div className={styles.buttonsContainer}>
          <Button onClick={handleNewConceptSuggestion}>{loc.suggestionForNewConcept}</Button>
        </div>
        <Heading
          level={2}
          size='xsmall'
        >
          {loc.changeRequest.changeRequest}
        </Heading>
        <div className={styles.listWrapper}>
          <ul className={styles.list}>
            {changeRequests.map(({ id, catalogId, conceptId, timeForProposal, proposedBy, status }) => (
              <li
                key={id}
                itemID={id}
                title={catalogId}
                className={styles.listItem}
                onClick={() => handleListItemClick(id)}
              >
                <div className={styles.listContent}>
                  <div>
                    <h2 className={styles.heading}>
                      {conceptId && conceptsWithChangeRequest
                        ? getTranslateText(
                            conceptsWithChangeRequest?.hits?.find((concept) => concept.originaltBegrep === conceptId)
                              ?.anbefaltTerm?.navn,
                          )
                        : loc.suggestionForNewConcept}
                    </h2>
                    <div className={styles.text}>
                      <p className={styles.time}>{convertTimestampToDateAndTime(timeForProposal)}</p>
                      <p className={styles.proposedBy}>
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
      </div>
    </>
  );
};

export async function getServerSideProps({ req, res, params }) {
  const session: Session = await getServerSession(req, res, authOptions);
  const { catalogId } = params;

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

  return {
    props: {
      organization,
      changeRequests,
      conceptsWithChangeRequest,
    },
  };
}

export default ChangeRequestsPage;
