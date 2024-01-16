'use client';

import { Button } from '@catalog-frontend/ui';
import { acceptChangeRequestAction, rejectChangeRequestAction } from '../../app/actions/change-requests/actions';
import { localization, validOrganizationNumber, validUUID } from '@catalog-frontend/utils';
import { useState } from 'react';
import Link from 'next/link';

interface Props {
  catalogId: string;
  changeRequestId: string;
}

export const AcceptChangeRequestButton = ({ catalogId, changeRequestId }: Props) => {
  const [isHandlingAction, setIsHandlingAction] = useState(false);
  const handleAccept = () => {
    if (!isHandlingAction) {
      setIsHandlingAction(true);
      acceptChangeRequestAction(catalogId, changeRequestId)
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
      onClick={handleAccept}
      disabled={isHandlingAction}
    >
      {localization.changeRequest.accept}
    </Button>
  );
};

export const RejectChangeRequestButton = ({ catalogId, changeRequestId }: Props) => {
  const [isHandlingAction, setIsHandlingAction] = useState(false);
  const handleReject = () => {
    if (!isHandlingAction) {
      setIsHandlingAction(true);
      rejectChangeRequestAction(catalogId, changeRequestId)
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
      variant='secondary'
      color='danger'
      onClick={handleReject}
      disabled={isHandlingAction}
    >
      {localization.changeRequest.reject}
    </Button>
  );
};

export const EditChangeRequestButton = ({ catalogId, changeRequestId }: Props) => {
  if (!validOrganizationNumber(catalogId) || !validUUID(changeRequestId)) {
    throw new Error('Invalid catalog id or change request id');
  }

  return (
    <Button
      as={Link}
      href={`/${catalogId}/change-requests/${changeRequestId}/edit`}
      variant='secondary'
      color='second'
    >
      {localization.button.edit}
    </Button>
  );
};
