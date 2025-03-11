'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Modal, Paragraph } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';

type TermsModalProps = {
  termsOfUseUrl: string;
  closeable: boolean;
  closeUrl: string;
};

const TermsNotAcceptedModal = ({ termsOfUseUrl, closeable, closeUrl }: TermsModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const handleGoToClick = () => {
    return router.push(termsOfUseUrl);
  };

  const handleCloseClick = () => {
    return router.push(closeUrl);
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      modalRef.current?.showModal();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal ref={modalRef}>
      <Modal.Header closeButton={false}>{localization.termsOfUse.modalHeader}</Modal.Header>
      <Modal.Content>
        <Paragraph size='sm'>{localization.termsOfUse.modalContent}</Paragraph>
      </Modal.Content>
      <Modal.Footer>
        <Button
          size='sm'
          onClick={handleGoToClick}
        >
          {localization.termsOfUse.modalGoToButton}
        </Button>
        {closeable && (
          <Button
            size='sm'
            variant='secondary'
            onClick={handleCloseClick}
          >
            {localization.termsOfUse.modalCloseButton}
          </Button>
        )}
        <Button
          size='sm'
          variant='secondary'
          color='danger'
          onClick={handleLogout}
        >
          {localization.auth.logout}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { TermsNotAcceptedModal };
