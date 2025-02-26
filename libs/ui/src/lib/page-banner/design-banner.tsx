import { getDesign, getOrganization, getBase64DesignLogo } from '@catalog-frontend/data-access';
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
  const logoResponse = await getBase64DesignLogo(catalogId, accessToken);

  return (
    <PageBanner
      title={title}
      subtitle={getTranslateText(organization.prefLabel).toString()}
      fontColor={design?.fontColor}
      backgroundColor={design?.backgroundColor}
      logo={design?.hasLogo ? logoResponse : undefined}
      logoDescription={design?.logoDescription}
    />
  );
};

export { DesignBanner };
