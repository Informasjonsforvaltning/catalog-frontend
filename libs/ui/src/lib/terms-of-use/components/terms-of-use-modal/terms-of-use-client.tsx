'use client';

import { useEffect, useRef } from 'react';
import { Button, Modal, Paragraph } from '@digdir/designsystemet-react';
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
    <Modal
      ref={modalRef}
      onBeforeClose={() => false}
    >
      <Modal.Header closeButton={false}>{localization.termsOfUse.notAcceptedTitle}</Modal.Header>
      <Modal.Content>
        <Paragraph size='sm'>{localization.termsOfUse.notAcceptedContent}</Paragraph>
      </Modal.Content>
      <Modal.Footer>
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
      </Modal.Footer>
    </Modal>
  );
};
