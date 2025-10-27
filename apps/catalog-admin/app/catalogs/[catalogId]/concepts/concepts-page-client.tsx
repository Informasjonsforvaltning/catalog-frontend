'use client';

import { NavigationCard } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { DatabaseIcon, PencilWritingIcon, RectangleSectionsIcon } from '@navikt/aksel-icons';
import styles from './concepts-page.module.css';

export interface ConceptsPageClientProps {
  catalogId: string;
}

export const ConceptsPageClient = ({ catalogId }: ConceptsPageClientProps) => {
  return (
    <>
      <div className={styles.cardsContainer}>
        <div className={styles.cardsGrid}>
          <NavigationCard
            icon={
              <DatabaseIcon
                title='a11y-title'
                fontSize='3rem'
              />
            }
            title={localization.catalogAdmin.codeLists}
            body={localization.catalogAdmin.manage.codeList}
            href={`/catalogs/${catalogId}/concepts/code-lists`}
          />
          <NavigationCard
            icon={<RectangleSectionsIcon fontSize='3rem' />}
            title={localization.catalogAdmin.internalFields}
            body={localization.catalogAdmin.manage.internalFields}
            href={`/catalogs/${catalogId}/concepts/internal-fields`}
          />
          <NavigationCard
            icon={<PencilWritingIcon fontSize='3rem' />}
            title={localization.catalogAdmin.editableFields}
            body={localization.catalogAdmin.manage.editableFields}
            href={`/catalogs/${catalogId}/concepts/editable-fields`}
          />
        </div>
      </div>
    </>
  );
};

export default ConceptsPageClient;
