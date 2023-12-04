'use client';

import { PageBanner } from '@catalog-frontend/ui';
import { Design } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useCatalogDesign } from '../../context/catalog-design';

export const Banner = (orgName, catalogId) => {
  const dbDesign: Design | undefined = useCatalogDesign();

  return (
    <PageBanner
      title={String(localization.catalogAdmin.manage.catalogAdmin)}
      subtitle={String(getTranslateText(orgName.orgName))}
      logoDescription={(dbDesign?.hasLogo && dbDesign?.logoDescription) || ''}
      backgroundColor={dbDesign?.backgroundColor}
      fontColor={dbDesign?.fontColor}
      logo={(dbDesign?.hasLogo && `/api/design/${catalogId}/logo`) || undefined}
    />
  );
};
