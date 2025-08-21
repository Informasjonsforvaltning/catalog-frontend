'use client';

import { Alert, Checkbox, Heading } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import { Terms, TermsAcceptation } from '@catalog-frontend/types';
import parse from 'html-react-parser';
import styles from './terms-and-conditions-page.module.css';
import { Button, Link, MarkdownComponent } from '@catalog-frontend/ui';
import { useState } from 'react';
import { acceptTermsAndConditions } from '@catalog-portal/app/actions';

interface Props {
  hasAdminPermission: boolean;
  catalogId: string;
  userName: string;
  latestTerms: Terms;
  acceptation: TermsAcceptation | undefined;
}

const TermsAndConditionsPageClient = ({ catalogId, hasAdminPermission, userName, latestTerms, acceptation }: Props) => {
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const latestIsAccepted = latestTerms.version === acceptation?.acceptedVersion;

  const handleAccept = async () => {
    const newAcceptation: TermsAcceptation = {
      orgId: catalogId,
      acceptedVersion: latestTerms.version,
      acceptorName: userName,
      acceptDate: new Date().toISOString(),
    };

    await acceptTermsAndConditions(newAcceptation);
    window.scrollTo(0, 0);
  };

  return (
    <div className='container'>
      <Heading
        level={1}
        spacing
      >
        {localization.termsOfUse.heading}
      </Heading>
      {latestIsAccepted && (
        <Alert
          severity='success'
          size='small'
        >
          <MarkdownComponent>
            {
              localization.formatString(
                localization.termsOfUse.acceptedByAndWhen,
                acceptation.acceptorName,
                new Date(acceptation.acceptDate).toLocaleDateString(),
              ) as string
            }
          </MarkdownComponent>
        </Alert>
      )}
      {!latestIsAccepted && !hasAdminPermission && (
        <Alert
          severity='warning'
          size='small'
          className={styles.alert}
        >
          <MarkdownComponent>{localization.termsOfUse.adminPermissionNeeded}</MarkdownComponent>
        </Alert>
      )}
      <div className={styles.terms}>{parse(latestTerms.text)}</div>
      {hasAdminPermission && (
        <div className={styles.agreement}>
          <Checkbox
            value='terms-checkbox'
            checked={isCheckboxChecked}
            disabled={latestIsAccepted}
            onChange={() => setIsCheckboxChecked(!isCheckboxChecked)}
          >
            {localization.termsOfUse.acceptCheckbox}
          </Checkbox>
          <Button
            disabled={!isCheckboxChecked || latestIsAccepted}
            onClick={handleAccept}
          >
            {localization.termsOfUse.acceptButton}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TermsAndConditionsPageClient;
