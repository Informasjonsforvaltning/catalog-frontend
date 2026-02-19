"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { useFormikContext } from "formik";
import { Button, Dialog, Heading } from "@digdir/designsystemet-react";
import { DataStorage, localization } from "@catalog-frontend/utils";
import type { StorageData } from "@catalog-frontend/types";
import { isEqual } from "lodash";
import { DialogActions } from "@catalog-frontend/ui-v2";
import style from "./formik-auto-saver.module.scss";

export type FormikAutoSaverProps = {
  id?: string;
  storage: DataStorage<StorageData>;
  restoreOnRender?: boolean;
  onRestore: (data: StorageData) => boolean;
  confirmMessage: (data: StorageData) => ReactNode;
};

export const FormikAutoSaver = ({
  id,
  storage,
  onRestore,
  confirmMessage,
  restoreOnRender,
}: FormikAutoSaverProps) => {
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
          if (onRestore(data)) {
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
        storage.set(
          { id, values, lastChanged: new Date().toISOString() },
          true,
        );
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
    <Dialog ref={modalRef}>
      <Heading data-size="2xs">
        {localization.alert.unsavedChangesHeading}
      </Heading>
      <div className={style.content}>{modalContent}</div>
      <DialogActions>
        <Button data-size="sm" onClick={handleRestoreClick}>
          {localization.button.restore}
        </Button>
        <Button
          data-size="sm"
          variant="secondary"
          data-color="danger"
          onClick={handleDiscardClick}
        >
          {localization.button.discard}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FormikAutoSaver.displayName = "FormikAutoSaver";
export default FormikAutoSaver;
