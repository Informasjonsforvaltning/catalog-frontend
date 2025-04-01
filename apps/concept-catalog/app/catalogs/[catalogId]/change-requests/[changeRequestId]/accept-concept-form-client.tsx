'use client';

import { useState } from 'react';
import { Button } from '@digdir/designsystemet-react';
import { formatISO, localization } from '@catalog-frontend/utils';
import { ChangeRequestStatusTagProps, LinkButton, Tag } from '@catalog-frontend/ui';
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
  allowApprove
}) => {
  const AcceptChangeRequestButton = () => {
    const [isHandlingAction, setIsHandlingAction] = useState(false);
    const handleAccept = () => {
      if (!isHandlingAction) {
        setIsHandlingAction(true);
        acceptChangeRequestAction(organization.organizationId, changeRequest.id)
          .catch((err) => {
            throw new Error(err);
          })
          .finally(() => {
            setIsHandlingAction(false);
          });
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
    const handleReject = () => {
      if (!isHandlingAction) {
        setIsHandlingAction(true);
        rejectChangeRequestAction(organization.organizationId, changeRequest.id)
          .catch((err) => {
            throw new Error(err);
          })
          .finally(() => {
            setIsHandlingAction(false);
          });
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
              {allowEdit && (              
                <EditChangeRequestButton />
              )}
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
  );
};
