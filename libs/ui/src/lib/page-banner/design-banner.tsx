import { getDesign, getOrganization } from '@catalog-frontend/data-access';
import { getTranslateText, getValidSession } from '@catalog-frontend/utils';
import { Organization } from '@catalog-frontend/types';
import { PageBanner } from './page-banner';

export interface BannerProps {
  catalogId: string;
  title: string;
}

const DesignBanner = async ({ catalogId, title }: BannerProps) => {
  const session = await getValidSession();
  const accessToken = session?.accessToken;

  if (!accessToken) {
    throw new Error('Unauthorized: No access token');
  }

  const design = await getDesign(catalogId, accessToken).then((res) => res.json());
  const organization: Organization = await getOrganization(catalogId).then((res) => res.json());

  return (
    <PageBanner
      title={title}
      subtitle={getTranslateText(organization.prefLabel).toString()}
      fontColor={design?.fontColor}
      backgroundColor={design?.backgroundColor}
      logo={design?.hasLogo ? `/api/design/${catalogId}/design/logo` : undefined} // OBS! The API-route needs to be added to each app
      logoDescription={design?.logoDescription}
    />
  );
};

export { DesignBanner };
