"use server";

import {
  getValidSession,
  hasAcceptedTermsForOrg,
  hasOrganizationReadPermission,
  localization,
} from "@catalog-frontend/utils";
import { Alert, Link } from "@digdir/designsystemet-react";
import styles from "./terms-of-use-alert.module.scss";

type TermsOfUseAlertProps = {
  catalogId: string;
};

const TermsOfUseAlert = async ({ catalogId }: TermsOfUseAlertProps) => {
  const session = await getValidSession();
  if (
    !session ||
    !hasOrganizationReadPermission(session.accessToken, catalogId)
  ) {
    return null;
  }

  const acceptedTerms = hasAcceptedTermsForOrg(session.accessToken, catalogId);
  if (acceptedTerms) {
    return null;
  }

  return (
    <Alert
      size="sm"
      severity="warning"
      title={localization.termsOfUse.notAcceptedTitle}
    >
      {localization.termsOfUse.notAcceptedContent}
      <div className={styles.buttonRow}>
        <Link
          href={`${process.env.CATALOG_PORTAL_BASE_URI}/terms-and-conditions/${catalogId}`}
        >
          {localization.termsOfUse.gotoTermsOfUse}
        </Link>
      </div>
    </Alert>
  );
};

export { TermsOfUseAlert };
