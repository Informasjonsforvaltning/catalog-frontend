'use client';

import { useEffect, useState } from 'react';
import { Button } from '@digdir/designsystemet-react';
import { formatISO, localization } from '@catalog-frontend/utils';
import { ButtonBar, ChangeRequestStatusTagProps, LinkButton, Snackbar, Tag } from '@catalog-frontend/ui';
import styles from './accept-concept-form-client.module.scss';
import ConceptForm from '../../../../../components/concept-form';
import { getTranslatedStatus } from '../../../../../utils/change-request';
import { acceptChangeRequestAction, rejectChangeRequestAction } from '../../../../actions/change-requests/actions';
import { usePathname, useSearchParams } from 'next/navigation';
import { ArrowLeftIcon } from '@navikt/aksel-icons';

export const AcceptConceptFormClient = ({
  organization,
  changeRequest,
  changeRequestAsConcept,
  originalConcept,
  conceptStatuses,
  codeListsResult,
  fieldsResult,
  usersResult,
  allowEdit,
  allowApprove,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [saved, setSaved] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'danger'>('success');

  const showSnackbarMessage = ({ message, severity }) => {
    setShowSnackbar(true);
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
  };

  const handleGotoOverview = () => {
    // Use window location to make sure query params are used on page render
    window.location.replace(
      `/catalogs/${organization.organizationId}/change-requests${!changeRequest.conceptId ? '?filter.itemType=suggestionForNewConcept' : ''}`,
    );
  };

  const AcceptChangeRequestButton = () => {
    const [isHandlingAction, setIsHandlingAction] = useState(false);
    const handleAccept = async () => {
      if (!isHandlingAction) {
        setIsHandlingAction(true);

        try {
          await acceptChangeRequestAction(organization.organizationId, changeRequest.id);
          showSnackbarMessage({ message: localization.changeRequest.acceptSuccessfull, severity: 'success' });
        } catch {
          showSnackbarMessage({ message: localization.changeRequest.acceptFailed, severity: 'danger' });
        } finally {
          setIsHandlingAction(false);
        }
      }
    };

    return (
      <Button
        variant='primary'
        color='success'
        onClick={handleAccept}
        disabled={isHandlingAction}
        size='sm'
      >
        {localization.changeRequest.accept}
      </Button>
    );
  };

  const RejectChangeRequestButton = () => {
    const [isHandlingAction, setIsHandlingAction] = useState(false);
    const handleReject = async () => {
      if (!isHandlingAction) {
        setIsHandlingAction(true);

        try {
          await rejectChangeRequestAction(organization.organizationId, changeRequest.id);
          showSnackbarMessage({ message: localization.changeRequest.rejectSuccessfull, severity: 'success' });
        } catch {
          showSnackbarMessage({ message: localization.changeRequest.rejectFailed, severity: 'danger' });
        } finally {
          setIsHandlingAction(false);
        }
      }
    };

    return (
      <Button
        variant='primary'
        color='danger'
        onClick={handleReject}
        disabled={isHandlingAction}
        size='sm'
      >
        {localization.changeRequest.reject}
      </Button>
    );
  };

  const FooterBar = () => {
    const info = `${localization.created}: ${
      changeRequest?.timeForProposal &&
      formatISO(changeRequest?.timeForProposal, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } ${localization.by} ${changeRequest.proposedBy?.name}`;

    return (
      <div className={styles.footerBar}>
        <div className={styles.footerButtons}>
          {changeRequest.status === 'OPEN' && (
            <>
              {allowApprove && (
                <>
                  <AcceptChangeRequestButton />
                  <RejectChangeRequestButton />
                </>
              )}
              {allowEdit && (
                <LinkButton
                  href={`/catalogs/${organization.organizationId}/change-requests/${changeRequest.id}/edit`}
                  variant='secondary'
                  color='second'
                  size='sm'
                >
                  {localization.button.edit}
                </LinkButton>
              )}
              {!allowApprove && !allowEdit && <>{localization.changeRequest.needWriteAccessForOther}</>}
              {!allowApprove && allowEdit && <>{localization.changeRequest.needWriteAccess}</>}
            </>
          )}
        </div>
        <div className={styles.info}>
          <div>{info}</div>
          <div>
            <Tag.ChangeRequestStatus
              statusKey={changeRequest.status}
              statusLabel={getTranslatedStatus(changeRequest.status) as ChangeRequestStatusTagProps['statusLabel']}
            />
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (searchParams.get('saved') === 'true') {
      setSaved(true);

      // Remove the param and update the URL shallowly
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('saved');

      const newUrl = newParams.toString().length > 0 ? `${pathname}?${newParams.toString()}` : pathname;

      window.history.replaceState(null, '', newUrl);
    }
  }, [searchParams, pathname]);

  return (
    <>
      <ButtonBar>
        <Button
          variant='tertiary'
          color='second'
          size='sm'
          onClick={handleGotoOverview}
        >
          <ArrowLeftIcon />
          {localization.button.backToOverview}
        </Button>
      </ButtonBar>
      <ConceptForm
        autoSave={false}
        catalogId={organization.organizationId}
        concept={changeRequestAsConcept}
        conceptStatuses={conceptStatuses}
        codeListsResult={codeListsResult}
        customFooterBar={<FooterBar />}
        fieldsResult={fieldsResult}
        initialConcept={originalConcept ?? {}}
        markDirty
        readOnly
        usersResult={usersResult}
        showSnackbarSuccessOnInit={saved}
      />
      {showSnackbar && (
        <Snackbar>
          <Snackbar.Item
            severity={snackbarSeverity}
            onClose={() => {
              setShowSnackbar(false);
            }}
          >
            {snackbarMessage}
          </Snackbar.Item>
        </Snackbar>
      )}
    </>
  );
};
