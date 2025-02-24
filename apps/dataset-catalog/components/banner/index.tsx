import { PageBanner } from '@catalog-frontend/ui';
import { getDesign, getOrganization } from '@catalog-frontend/data-access';
import { getTranslateText, getValidSession, localization } from '@catalog-frontend/utils';
import { Organization } from '@catalog-frontend/types';

export interface BannerProps {
  catalogId: string;
}

const Banner = async ({ catalogId }: BannerProps) => {
  const session = await getValidSession();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error('Unauthorized: No access token');
  }

  const design = await getDesign(catalogId, accessToken).then((res) => res.json());
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <PageBanner
      title={localization.catalogType.dataset}
      subtitle={getTranslateText(organization.prefLabel).toString()}
      fontColor={design?.fontColor}
      backgroundColor={design?.backgroundColor}
      logo={design?.hasLogo ? `/api/catalog-admin/${catalogId}/design/logo` : undefined}
      logoDescription={design?.logoDescription}
    />
  );
};

export default Banner;
