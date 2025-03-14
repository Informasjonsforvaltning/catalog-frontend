'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal, Paragraph } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import { TermsOfUseButton } from '../terms-of-use-button';

type TermsModalProps = {
  termsOfUseUrl: string;
  closeUrl: string;
};

export const TermsOfUseModalClient = ({ termsOfUseUrl, closeUrl }: TermsModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const handleCloseClick = () => {
    router.push(closeUrl);   
  };

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, []);

  return (
    <Modal ref={modalRef} onBeforeClose={() => false}>
      <Modal.Header closeButton={false}>{localization.termsOfUse.notAcceptedTitle}</Modal.Header>
      <Modal.Content>
        <Paragraph size='sm'>{localization.termsOfUse.notAcceptedContent}</Paragraph>
      </Modal.Content>
      <Modal.Footer>
        <TermsOfUseButton url={termsOfUseUrl} />
        <Button size='sm' variant='secondary' onClick={handleCloseClick}>
          {localization.termsOfUse.cancel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
