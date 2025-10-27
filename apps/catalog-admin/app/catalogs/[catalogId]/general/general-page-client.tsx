'use client';

import { NavigationCard } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { PaletteIcon, PersonIcon } from '@navikt/aksel-icons';
import styles from './general-page.module.css';

export interface GeneralPageClientProps {
  catalogId: string;
}

export const GeneralPageClient = ({ catalogId }: GeneralPageClientProps) => {
  return (
    <>
      <div className={styles.cardsContainer}>
        <NavigationCard
          icon={<PaletteIcon fontSize='3rem' />}
          title={localization.catalogAdmin.design}
          body={localization.catalogAdmin.manage.design}
          href={`/catalogs/${catalogId}/general/design`}
        />
        <NavigationCard
          icon={<PersonIcon fontSize='3rem' />}
          title={localization.catalogAdmin.username}
          body={localization.catalogAdmin.manage.username}
          href={`/catalogs/${catalogId}/general/users`}
        />
      </div>
    </>
  );
};

export default GeneralPageClient;
