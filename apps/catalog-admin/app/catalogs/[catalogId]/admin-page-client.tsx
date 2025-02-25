'use client';

import { NavigationCard } from '@catalog-frontend/ui';

import { localization } from '@catalog-frontend/utils';
import { InformationSquareIcon, TableIcon } from '@navikt/aksel-icons';
import styles from './admin-page.module.css';

export interface AdminPageClientProps {
  catalogId: string;
}

export const AdminPageClient = ({ catalogId }: AdminPageClientProps) => {
  return (
    <>
      <div>
        <div className={styles.cardsContainer}>
          <NavigationCard
            icon={<InformationSquareIcon fontSize='3rem' />}
            title={localization.general}
            body={localization.catalogAdmin.description.general}
            href={`/catalogs/${catalogId}/general`}
          />
          <NavigationCard
            icon={
              <TableIcon
                title='a11y-title'
                fontSize='3rem'
              />
            }
            title={localization.catalogType.concept}
            body={localization.catalogAdmin.description.conceptCatalog}
            href={`/catalogs/${catalogId}/concepts`}
          />
        </div>
      </div>
    </>
  );
};

export default AdminPageClient;
