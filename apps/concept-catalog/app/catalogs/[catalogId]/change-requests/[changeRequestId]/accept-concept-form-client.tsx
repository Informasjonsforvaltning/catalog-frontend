'use client';

import { useState } from 'react';
import { Button } from '@digdir/designsystemet-react';
import { formatISO, localization } from '@catalog-frontend/utils';
import { ChangeRequestStatusTagProps, LinkButton, Snackbar, Tag } from '@catalog-frontend/ui';
import styles from './accept-concept-form-client.module.scss';
import ConceptForm from '../../../../../components/concept-form';
import { getTranslatedStatus } from '../../../../../utils/change-request';
import { acceptChangeRequestAction, rejectChangeRequestAction } from '../../../../actions/change-requests/actions';

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
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'danger'>('success');

  const showSnackbarMessage = ({ message, severity }) => {
    setShowSnackbar(true);
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
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

  const EditChangeRequestButton = () => {
    return (
      <LinkButton
        href={`/catalogs/${organization.organizationId}/change-requests/${changeRequest.id}/edit`}
        variant='secondary'
        color='second'
        size='sm'
      >
        {localization.button.edit}
      </LinkButton>
    );
  };

  const CancelButton = () => {
    return (
      <LinkButton
        href={`/catalogs/${organization.organizationId}/change-requests`}
        variant='secondary'
        color='second'
        size='sm'
      >
        Tilbake
      </LinkButton>
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
          {changeRequest.status === 'OPEN' ? (
            <>
              {allowApprove && (
                <>
                  <AcceptChangeRequestButton />
                  <RejectChangeRequestButton />
                </>
              )}
              {allowEdit && <EditChangeRequestButton />}
              {!(allowApprove || allowEdit) && (
                <>
                  <CancelButton />
                  Skrivetilgang kreves for å godta eller avvise.
                </>
              )}
            </>
          ) : (
            <CancelButton />
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

  return (
    <>
      {showSnackbar && (
        <Snackbar>
          <Snackbar.Item
            severity={snackbarSeverity}
            onClick={() => {
              setShowSnackbar(false);
            }}
          >
            {snackbarMessage}
          </Snackbar.Item>
        </Snackbar>
      )}
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
      />
    </>
  );
};
