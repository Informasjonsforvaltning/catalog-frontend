import { PageBanner } from '@catalog-frontend/ui';
import { useRouter } from 'next/router';
import { Design } from '@catalog-frontend/types';
import { getTranslateText } from '@catalog-frontend/utils';
import { useGetDesign } from '../../hooks/design';
import { useAdminState } from '../../context/admin';

export const Banner = () => {
  const router = useRouter();
  const catalogId = `${router.query.catalogId}`;

  const { data: getDesign } = useGetDesign(catalogId);
  const dbDesign: Design = getDesign;

  const adminContext = useAdminState();
  const { orgName } = adminContext;

  return (
    <PageBanner
      title={'Intern Begrepskatalog'}
      subtitle={String(getTranslateText(orgName))}
      logoDescription={dbDesign?.hasLogo && dbDesign?.logoDescription}
      backgroundColor={dbDesign?.backgroundColor}
      fontColor={dbDesign?.fontColor}
      logo={(dbDesign?.hasLogo && `/api/design/${catalogId}/logo`) || null}
    />
  );
};
