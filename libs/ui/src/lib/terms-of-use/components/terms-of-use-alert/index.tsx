'use server';

import { getValidSession, hasAcceptedTermsForOrg, hasOrganizationReadPermission, localization } from '@catalog-frontend/utils';
import { Alert, Button } from '@digdir/designsystemet-react';
import styles from './terms-of-use-alert.module.scss';
import { TermsOfUseButton } from '../terms-of-use-button';

type TermsOfUseAlertProps = {
  catalogId: string;
};

const TermsOfUseAlert = async ({ catalogId }: TermsOfUseAlertProps) => {
  const session = await getValidSession();
  if (!session?.accessToken || !hasOrganizationReadPermission(session?.accessToken, catalogId)) {
    return null;
  }

  const acceptedTerms = hasAcceptedTermsForOrg(`${session?.accessToken}`, catalogId);
  if (acceptedTerms) {
    return null;
  }

  return (
    <Alert
      size='sm'
      severity='warning'
      title={localization.termsOfUse.notAcceptedTitle}
    >
      {localization.termsOfUse.notAcceptedContent}
      <div className={styles.buttonRow}>
        <TermsOfUseButton url={`${process.env.FDK_REGISTRATION_BASE_URI}/terms-and-conditions/${catalogId}`} />
      </div>
    </Alert>
  );
};

export { TermsOfUseAlert };