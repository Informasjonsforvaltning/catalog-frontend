'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { useFormikContext } from 'formik';
import { Button, Modal } from '@digdir/designsystemet-react';
import { DataStorage, localization } from '@catalog-frontend/utils';
import type { StorageData } from '@catalog-frontend/types';
import { isEqual } from 'lodash';

export type FormikAutoSaverProps = {
  id?: string;
  storage: DataStorage<StorageData>;
  restoreOnRender?: boolean;
  onRestore: (data: StorageData) => boolean;
  confirmMessage: (data: StorageData) => ReactNode;
};

export const FormikAutoSaver = ({ id, storage, onRestore, confirmMessage, restoreOnRender }: FormikAutoSaverProps) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const { values, initialValues } = useFormikContext<any>();
  const [isInitialized, setIsInitialized] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleRestoreClick = () => {
    const data = storage.get();
    const proceed = data ? onRestore(data) : true;    
    if (proceed) {
      modalRef?.current?.close();
      setIsInitialized(true);
    }
  };

  const handleDiscardClick = () => {
    storage.delete();
    modalRef.current?.close();
    setIsInitialized(true);
  };

  // Load saved data from local storage on mount
  useEffect(() => {
    const data = storage.get();
    if (data) {      
      if (restoreOnRender) {
        if (data) {
          if(onRestore(data)) {            
            setIsInitialized(true);
          }
        }
      } else {
        setModalContent(confirmMessage(data));
        modalRef.current?.showModal();
      }
    } else {
      setIsInitialized(true);
    }
  }, []);

  // Save form data to local storage on change
  useEffect(() => {
    // Don't save until Formik is fully initialized
    if (!isInitialized) {
      return;
    } 

    const unsubscribe = storage.subscribe((state) => {
      if (state.isDirty && state.mainData === null) {
        storage.set({ id, values, lastChanged: new Date().toISOString() }, true);
      }
    });
    if (!isEqual(initialValues, values)) {
      storage.set({ id, values, lastChanged: new Date().toISOString() });
    } else {
      storage.delete();
    }
    return () => unsubscribe();
  }, [initialValues, values, isInitialized, id, storage]);

  return (
    <Modal ref={modalRef}>
      <Modal.Header closeButton={false}>Ulagrede endringer</Modal.Header>
      <Modal.Content>{modalContent}</Modal.Content>
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
};

FormikAutoSaver.displayName = 'FormikAutoSaver';
export default FormikAutoSaver;
