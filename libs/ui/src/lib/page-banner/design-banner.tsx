import {
  getDesign,
  getOrganization,
  getBase64DesignLogo,
} from "@catalog-frontend/data-access";
import {
  getTranslateText,
  getValidSession,
  redirectToSignIn,
} from "@catalog-frontend/utils";
import { Organization } from "@catalog-frontend/types";
import { PageBanner } from "./page-banner";

export interface BannerProps {
  catalogId: string;
  title: string;
}

const DesignBanner = async ({ catalogId, title }: BannerProps) => {
  const session = await getValidSession();

  if (!session) {
    return redirectToSignIn();
  }

  const design = await getDesign(catalogId, session.accessToken).then((res) =>
    res.json(),
  );
  const organization: Organization = await getOrganization(catalogId);
  const logoResponse = await getBase64DesignLogo(
    catalogId,
    session.accessToken,
  );
  const logo = logoResponse ? logoResponse : "undefined";

  return (
    <PageBanner
      title={title}
      subtitle={getTranslateText(organization.prefLabel)}
      fontColor={design?.fontColor}
      backgroundColor={design?.backgroundColor}
      logo={design?.hasLogo ? logo : undefined}
      logoDescription={design?.logoDescription}
    />
  );
};

export { DesignBanner };
