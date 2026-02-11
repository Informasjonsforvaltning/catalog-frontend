"use server";

import {
  getValidSession,
  hasAcceptedTermsForOrg,
} from "@catalog-frontend/utils";
import { TermsOfUseModalClient } from "./terms-of-use-client";

type TermsOfUseModalProps = {
  catalogId: string;
};

const TermsOfUseModal = async ({ catalogId }: TermsOfUseModalProps) => {
  const session = await getValidSession();
  if (!session) {
    return null;
  }

  const acceptedTerms = hasAcceptedTermsForOrg(session.accessToken, catalogId);
  if (acceptedTerms) {
    return null;
  }

  return (
    <TermsOfUseModalClient
      termsOfUseUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/terms-and-conditions/${catalogId}`}
      closeUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
    />
  );
};

export { TermsOfUseModal };
