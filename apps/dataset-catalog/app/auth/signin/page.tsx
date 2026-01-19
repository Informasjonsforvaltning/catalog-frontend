import {
  BreadcrumbType,
  Breadcrumbs,
  CenterContainer,
  KeycloakSignin,
  PageBanner,
  Spinner,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Suspense } from "react";

export const SignIn = () => {
  const breadcrumbList = [
    {
      href: `#`,
      text: localization.auth.login,
    },
  ] as BreadcrumbType[];

  return (
    <>
      <Breadcrumbs
        breadcrumbList={breadcrumbList}
        catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
      />
      <PageBanner
        title={localization.catalogType.dataset}
        subtitle={localization.auth.login}
      />
      <CenterContainer>
        <Suspense fallback={<Spinner />}>
          <KeycloakSignin />
        </Suspense>
      </CenterContainer>
    </>
  );
};

export default SignIn;
