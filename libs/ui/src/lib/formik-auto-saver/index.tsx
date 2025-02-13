'use client';

import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useFormikContext } from 'formik';
import { Button, Modal } from '@digdir/designsystemet-react';
import { isEqual } from 'lodash';
import { localization } from '@catalog-frontend/utils';

export type StorageData = {
  values: any;
  lastChanged: string;
};

export type FormikAutoSaverProps = {
  storageKey: string;
  restoreOnRender?: boolean;
  onRestore: (data: StorageData) => void;
  confirmMessage: (data : StorageData) => ReactNode;  
};

export type FormikAutoSaverRef = {
  discard: () => void;
}

export const FormikAutoSaver = forwardRef<FormikAutoSaverRef, FormikAutoSaverProps>(({ storageKey, onRestore, confirmMessage, restoreOnRender}: FormikAutoSaverProps, ref) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const { initialValues, values, setValues } = useFormikContext<any>();
  const modalRef = useRef<HTMLDialogElement>(null);

  const getStorageData = () => {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return null;
  }

  const handleRestoreClick = () => {
    if (onRestore) {
      onRestore(getStorageData());
    } 
    modalRef?.current?.close();
  };

  const handleDiscardClick = () => {
    localStorage.removeItem(storageKey);
    modalRef.current?.close();
  };

  useImperativeHandle(ref, () => {
    return {
      discard() {
        localStorage.removeItem(storageKey);
      }
    };
  });

  // Load saved data from local storage on mount
  useEffect(() => {    
    const data = getStorageData();
    if (data) {
      setModalContent(confirmMessage(getStorageData()));
      if(restoreOnRender) {
        setValues(data.values);
      } else {
        modalRef.current?.showModal();
      }      
    }
  }, []);

  // Save form data to local storage on change
  useEffect(() => {
    if (!isEqual(initialValues, values)) {
      localStorage.setItem(storageKey, JSON.stringify({ values, lastChanged: Date.now() }));
    }
  }, [values]);

  return (
    <Modal ref={modalRef}>
      <Modal.Header closeButton={false}>Ulagrede endringer</Modal.Header>
      <Modal.Content>
        {modalContent}
      </Modal.Content>
      <Modal.Footer>
        <Button
          size='sm'
          onClick={handleRestoreClick}
        >
          {localization.button.restore}
        </Button>
        <Button
          size='sm'
          variant='secondary'
          color='danger'
          onClick={handleDiscardClick}
        >
          {localization.button.discard}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default FormikAutoSaver;
