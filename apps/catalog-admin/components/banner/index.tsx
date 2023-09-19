import { PageBanner } from '@catalog-frontend/ui';
import { useRouter } from 'next/router';
import { Design } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useCatalogDesign } from '../../context/catalog-design';

export const Banner = (orgName) => {
  const router = useRouter();
  const catalogId = `${router.query.catalogId}`;

  const dbDesign: Design = useCatalogDesign();

  return (
    <PageBanner
      title={String(getTranslateText(localization.catalogAdmin.manage.catalogAdmin))}
      subtitle={String(getTranslateText(orgName.orgName))}
      logoDescription={dbDesign?.hasLogo && dbDesign?.logoDescription}
      backgroundColor={dbDesign?.backgroundColor}
      fontColor={dbDesign?.fontColor}
      logo={dbDesign?.hasLogo && `/api/design/${catalogId}/logo`}
    />
  );
};
