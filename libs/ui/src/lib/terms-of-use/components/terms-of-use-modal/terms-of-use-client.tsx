'use client';

import { useEffect, useRef } from 'react';
import { Button, Dialog, Paragraph } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';

type TermsModalProps = {
  termsOfUseUrl: string;
  closeUrl: string;
};

export const TermsOfUseModalClient = ({ termsOfUseUrl, closeUrl }: TermsModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, []);

  return (
    <Dialog
      ref={modalRef}
      closedby='none'
    >
      <Dialog.Block>{localization.termsOfUse.notAcceptedTitle}</Dialog.Block>
      <Dialog.Block>
        <Paragraph size='sm'>{localization.termsOfUse.notAcceptedContent}</Paragraph>
      </Dialog.Block>
      <Dialog.Block>
        <Button
          data-size='sm'
          asChild
        >
          <a
            target='_blank'
            rel='noreferrer'
            href={termsOfUseUrl}
          >
            {localization.termsOfUse.gotoTermsOfUse}
          </a>
        </Button>
        <Button
          data-size='sm'
          variant='secondary'
          asChild
        >
          <a
            target='_blank'
            rel='noreferrer'
            href={closeUrl}
          >
            {localization.termsOfUse.cancel}
          </a>
        </Button>
      </Dialog.Block>
    </Dialog>
  );
};
