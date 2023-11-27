'use client';

import { PageBanner, Tag } from '@catalog-frontend/ui';
import {
  capitalizeFirstLetter,
  convertTimestampToDateAndTime,
  localization as loc,
  validOrganizationNumber,
  validUUID,
} from '@catalog-frontend/utils';
import styles from './change-requests-page.module.css';
import { useRouter } from 'next/navigation';
import { Button, Heading, Link } from '@digdir/design-system-react';
import { useCatalogDesign } from '../../../context/catalog-design';
import cn from 'classnames';

export const ChangeRequestsPageClient = ({ catalogId, organization, changeRequests }) => {
  const pageSubtitle = organization?.name ?? '';
  const router = useRouter();

  const handleNewConceptSuggestionClick = () => {
    if (validOrganizationNumber(catalogId)) {
      router.push(`/${catalogId}/change-requests/new`);
    }
  };

  const design = useCatalogDesign();

  return (
    <>
      <PageBanner
        title={loc.catalogType.concept}
        subtitle={pageSubtitle}
        fontColor={design?.fontColor}
        backgroundColor={design?.backgroundColor}
        logo={design?.hasLogo ? `/api/catalog-admin/${catalogId}/design/logo` : undefined}
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
        <div className={styles.listWrapper}>
          <ul className={styles.list}>
            {changeRequests.map(({ id, title, catalogId, timeForProposal, proposedBy, status }) => (
              <li
                key={id}
                itemID={id}
                title={catalogId}
                className={styles.listItem}
              >
                <div className={styles.listContent}>
                  <div>
                    <Heading
                      level={3}
                      size={'xsmall'}
                    >
                      <Link
                        href={
                          validOrganizationNumber(catalogId) &&
                          validUUID(id) &&
                          changeRequests.find(({ id: changeRequestId }) => changeRequestId === id)
                            ? `/${catalogId}/change-requests/${id}`
                            : '#'
                        }
                        className={title ? styles.heading : cn(styles.heading, styles.noName)}
                      >
                        {title || `(${loc.changeRequest.noName})`}
                      </Link>
                    </Heading>
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
      </div>
    </>
  );
};

export default ChangeRequestsPageClient;
