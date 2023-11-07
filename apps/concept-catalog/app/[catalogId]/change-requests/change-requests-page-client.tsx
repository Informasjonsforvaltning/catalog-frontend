'use client';

import { Button, PageBanner, Tag } from '@catalog-frontend/ui';
import {
  capitalizeFirstLetter,
  convertTimestampToDateAndTime,
  getTranslateText,
  localization as loc,
  validChangeRequestId,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import styles from './change-requests-page.module.css';
import { useRouter } from 'next/navigation';
import { Heading } from '@digdir/design-system-react';

export const ChangeRequestsPageClient = ({ catalogId, organization, changeRequests, conceptsWithChangeRequest }) => {
  const pageSubtitle = organization?.name ?? '';
  const router = useRouter();

  const handleNewConceptSuggestionClick = () => {
    if (validOrganizationNumber(catalogId)) {
      router.push(`/${catalogId}/change-requests/new`);
    }
  };

  const handleListItemClick = ({ id: changeRequestId }) => {
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
          <Button onClick={handleNewConceptSuggestionClick}>{loc.suggestionForNewConcept}</Button>
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

export default ChangeRequestsPageClient;
