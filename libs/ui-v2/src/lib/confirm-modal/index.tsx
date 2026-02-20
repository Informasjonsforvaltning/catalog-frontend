"use client";

import { ReactNode, useEffect, useRef } from "react";
import { Button, Dialog, Heading } from "@digdir/designsystemet-react";
import { localization } from "@catalog-frontend/utils";
import style from "./confirm-modal.module.scss";
import { DialogActions } from "@catalog-frontend/ui-v2";

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
    <Dialog ref={modalRef}>
      <Heading className={style.heading} data-size="2xs">
        {title}
      </Heading>
      <div className={style.content}>{content}</div>
      <DialogActions>
        <Button data-size="sm" onClick={handleSuccess}>
          {successButtonText ?? localization.button.success}
        </Button>
        {!hideCancel && (
          <Button data-size="sm" variant="secondary" onClick={handleCancel}>
            {cancelButtonText ?? localization.button.cancel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
