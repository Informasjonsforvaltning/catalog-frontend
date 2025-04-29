'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { Button, Modal } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import style from './confirm-modal.module.scss';

type ConfirmModalProps = {
  title: string;
  content: ReactNode;
  successButtonText?: string;
  cancelButtonText?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  hideCancel?: boolean;
  show?: boolean;
};

export const ConfirmModal = ({
  title,
  content,
  successButtonText,
  cancelButtonText,
  onSuccess,
  onCancel,
  hideCancel,
  show = true,
}: ConfirmModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleSuccess = () => {
    modalRef.current?.close();
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleCancel = () => {
    modalRef.current?.close();
    if (onCancel) {
      onCancel();
    }
  };

  useEffect(() => {
    if (show) {
      modalRef.current?.showModal();
    }
  }, [show]);

  return (
    <Modal ref={modalRef}>
      <Modal.Header closeButton={false}>{title}</Modal.Header>
      <Modal.Content className={style.content}>{content}</Modal.Content>
      <Modal.Footer>
        <Button
          size='sm'
          onClick={handleSuccess}
        >
          {successButtonText ?? localization.button.success}
        </Button>
        {!hideCancel && (
          <Button
            size='sm'
            variant='secondary'
            onClick={handleCancel}
          >
            {cancelButtonText ?? localization.button.cancel}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};
