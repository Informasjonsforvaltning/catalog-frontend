import { PageBanner } from '@catalog-frontend/ui';
import { useRouter } from 'next/router';
import { Design } from '@catalog-frontend/types';
import { getTranslateText, localization } from '@catalog-frontend/utils';
import { useAdminState } from '../../context/admin';
import { useCatalogDesign } from '../../context/catalog-design';

export const Banner = () => {
  const router = useRouter();
  const catalogId = `${router.query.catalogId}`;

  const adminContext = useAdminState();
  const { orgName } = adminContext;
  const dbDesign: Design = useCatalogDesign();

  return (
    <PageBanner
      title={String(getTranslateText(localization.catalogAdmin.manage.catalogAdmin))}
      subtitle={String(getTranslateText(orgName))}
      logoDescription={dbDesign?.hasLogo && dbDesign?.logoDescription}
      backgroundColor={dbDesign?.backgroundColor}
      fontColor={dbDesign?.fontColor}
      logo={dbDesign?.hasLogo && `/api/design/${catalogId}/logo`}
    />
  );
};
