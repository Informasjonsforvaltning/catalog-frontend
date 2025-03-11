import { getValidSession } from '@catalog-frontend/utils';
import { TermsNotAcceptedWrapper } from './terms-not-accepted-wrapper';

export const TermsOfUseModal = async () => {
  const session = await getValidSession();

  if (session) {
    return (
      <TermsNotAcceptedWrapper
        session={session}
        termsBaseUri={process.env.FDK_REGISTRATION_BASE_URI}
        catalogPortalBaseUri={process.env.CATALOG_PORTAL_BASE_URI}
      />
    );
  }
};
