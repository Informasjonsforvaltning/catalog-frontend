'use client';

import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useFormikContext } from 'formik';
import { Button, Modal } from '@digdir/designsystemet-react';
import { isEqual } from 'lodash';
import { CatalogStorage, localization } from '@catalog-frontend/utils';

export type StorageData = {
  values: any;
  lastChanged: string;
};

export type FormikAutoSaverProps = {
  storage: CatalogStorage<StorageData>;
  restoreOnRender?: boolean;
  onRestore: (data: StorageData) => void;
  confirmMessage: (data : StorageData) => ReactNode;  
};

export type FormikAutoSaverRef = {
  discard: () => void;
}

export const FormikAutoSaver = forwardRef<FormikAutoSaverRef, FormikAutoSaverProps>(({ storage, onRestore, confirmMessage, restoreOnRender}: FormikAutoSaverProps, ref) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const { initialValues, values, setValues } = useFormikContext<any>();
  const modalRef = useRef<HTMLDialogElement>(null);
  
  const handleRestoreClick = () => {
    const data = storage.get();
    if (onRestore && data) {
      onRestore(data);
    } 
    modalRef?.current?.close();
  };

  const handleDiscardClick = () => {
    storage.delete();
    modalRef.current?.close();
  };

  useImperativeHandle(ref, () => {
    return {
      discard() {
        storage.delete();
      }
    };
  });

  // Load saved data from local storage on mount
  useEffect(() => {    
    const data = storage.get();
    if (data) {
      setModalContent(confirmMessage(data));
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
      storage.set({ values, lastChanged: new Date().toISOString() });
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
