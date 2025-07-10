'use client';

import { Alert, Checkbox, Heading } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import { Terms, TermsAcceptation } from '@catalog-frontend/types';
import parse from 'html-react-parser';
import styles from './terms-and-conditions-page.module.css';
import { Button, Link } from '@catalog-frontend/ui';
import { useState } from 'react';
import { acceptTermsAndConditions } from '@catalog-portal/app/actions';
import Markdown from 'react-markdown';

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
          <Markdown>
            {
              localization.formatString(
                localization.termsOfUse.acceptedByAndWhen,
                acceptation.acceptorName,
                new Date(acceptation.acceptDate).toLocaleDateString(),
              ) as string
            }
          </Markdown>
        </Alert>
      )}
      {!latestIsAccepted && !hasAdminPermission && (
        <Alert
          severity='warning'
          size='small'
          className={styles.alert}
        >
          <Markdown>{localization.termsOfUse.adminPermissionNeeded}</Markdown>
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
