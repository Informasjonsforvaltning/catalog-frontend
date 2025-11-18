'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Dialog } from '@digdir/designsystemet-react';
import { LinkButton } from '../button';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import { localization } from '@catalog-frontend/utils';

type LinkButtonConfig = {
  href: string;
  label: string;
};

type NewDatasetModalProps = {
  catalogId: string;
  triggerButtonText?: string;
  modalTitle?: string;
  firstButton: LinkButtonConfig;
  secondButton: LinkButtonConfig;
};

export const NewDatasetModal = ({
  catalogId,
  triggerButtonText,
  modalTitle,
  firstButton,
  secondButton,
}: NewDatasetModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    modalRef.current?.showModal();
  };

  const handleClose = () => {
    setIsOpen(false);
    modalRef.current?.close();
  };

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    }
  }, [isOpen]);

  return (
    <>
      <Button
        variant='primary'
        data-size='sm'
        onClick={handleOpen}
      >
        <PlusCircleIcon fontSize='1.2rem' />
        {triggerButtonText ?? localization.datasetForm.button.addDataset}
      </Button>
      <Dialog
        ref={modalRef}
        onClose={handleClose}
      >
        <Dialog.Block>{modalTitle ?? localization.datasetForm.button.addDataset}</Dialog.Block>
        <Dialog.Block>
          <LinkButton
            variant='primary'
            data-size='sm'
            href={firstButton.href}
          >
            {firstButton.label}
          </LinkButton>
          <LinkButton
            variant='secondary'
            data-size='sm'
            href={secondButton.href}
          >
            {secondButton.label}
          </LinkButton>
        </Dialog.Block>
      </Dialog>
    </>
  );
};

