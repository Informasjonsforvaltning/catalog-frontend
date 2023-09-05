import { PageBanner } from '@catalog-frontend/ui';
import { useRouter } from 'next/router';
import { Design } from '@catalog-frontend/types';
import { getTranslateText } from '@catalog-frontend/utils';
import { useAdminState } from '../../context/admin';
import { useCatalogDesign } from 'apps/catalog-admin/context/catalog-design';

export const Banner = () => {
  const router = useRouter();
  const catalogId = `${router.query.catalogId}`;

  const adminContext = useAdminState();
  const { orgName } = adminContext;
  const dbDesign: Design = useCatalogDesign();

  return (
    <PageBanner
      title={'Intern Begrepskatalog'}
      subtitle={String(getTranslateText(orgName))}
      logoDescription={dbDesign?.hasLogo && dbDesign?.logoDescription}
      backgroundColor={dbDesign?.backgroundColor}
      fontColor={dbDesign?.fontColor}
      logo={dbDesign?.hasLogo && `/api/design/${catalogId}/logo`}
    />
  );
};
