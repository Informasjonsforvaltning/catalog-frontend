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

export const ChangeRequestsPage = ({ organization, changeRequests, conceptsWithChangeRequest }) => {
  const pageSubtitle = organization?.name ?? '';
  const router = useRouter();

  const handleListItemClick = (e) => {
    const changeRequestId = e.target.attributes.itemID.value;
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
          <Button onClick={() => alert('Under utvikling')}>{loc.suggestionForNewConcept}</Button>
        </div>
        <Heading
          level={2}
          size='xsmall'
        >
          Endringsforslag
        </Heading>
        <div className={styles.listWrapper}>
          <ul className={styles.list}>
            {changeRequests.map((changeRequest) => (
              <li
                key={changeRequest.id}
                itemID={changeRequest.id}
                title={changeRequest.catalogId}
                className={styles.listItem}
                onClick={handleListItemClick}
              >
                <div className={styles.listContent}>
                  <div>
                    <h2 className={styles.heading}>
                      {changeRequest?.conceptId && conceptsWithChangeRequest
                        ? getTranslateText(
                            conceptsWithChangeRequest?.hits?.find(
                              (concept) => concept.originaltBegrep === changeRequest.conceptId,
                            )?.anbefaltTerm?.navn,
                          )
                        : 'Forslag til nytt begrep'}
                    </h2>
                    <div className={styles.text}>
                      <p className={styles.time}>{convertTimestampToDateAndTime(changeRequest.timeForProposal)}</p>
                      <p className={styles.proposedBy}>
                        {changeRequest.proposedBy.name
                          .split(' ')
                          .map((namePart) => capitalizeFirstLetter(namePart))
                          .join(' ')}
                      </p>
                    </div>
                  </div>
                  <div className={styles.status}>
                    <Tag>{changeRequest.status}</Tag>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ req, params }) {
  const token = await getToken({ req });
  const { catalogId } = params;

  const hasPermission = token && hasOrganizationReadPermission(token.access_token, catalogId);
  if (!hasPermission) {
    return {
      redirect: {
        permanent: false,
        destination: `/${catalogId}/no-access`,
      },
    };
  }

  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  const changeRequests: ChangeRequest[] = await getChangeRequests(catalogId, `${token.access_token}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`getChangeRequests failed with status ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Error:', error);
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

  const response = await searchConceptsForCatalog(catalogId, searchQuery, token.access_token);
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
