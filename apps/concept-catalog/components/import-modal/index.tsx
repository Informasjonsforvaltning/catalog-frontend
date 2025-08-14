import React, { useRef, useState } from 'react';
import { localization } from '@catalog-frontend/utils';
import { LinkButton, UploadButton } from '@catalog-frontend/ui';
import { useImportConcepts, useSendConcepts } from '../../hooks/import';
import { Button, Modal, Spinner } from '@digdir/designsystemet-react';
import styles from './import-modal.module.scss';
import { FileImportIcon, TasklistSendIcon } from '@navikt/aksel-icons';
import { ImportConceptRdf } from './concept-rdf-upload';
import Markdown from 'react-markdown';
import { Concept } from '@catalog-frontend/types';

interface ImportProps {
  catalogId: string;
}

export function ImportModal({ catalogId }: ImportProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [uploadedConcepts, setUploadedConcepts] = useState<Array<Concept>>(new Array<Concept>());
  const modalRef = useRef<HTMLDialogElement>(null);

  const importConcepts = useImportConcepts(catalogId, setIsUploading, setIsUploaded);
  const sendConcepts = useSendConcepts(catalogId)//, setIsSending);

  const onImportUpload = (event) => {
    importConcepts.mutate(event.target.files[0], {
      onSuccess: (concepts) => {
        setUploadedConcepts(concepts)
        setIsUploading(false);
      },
      onError: (error) => alert('Import failed: ' + error) });
  };

  const send = async () => {
    if(uploadedConcepts.length === 0) {
      alert("Ingen bereper var funnet i opplastet fil.");
      return
    }
    setIsSending(true)
    sendConcepts.mutate(uploadedConcepts)
  }

  const cancel = () => {
    setIsUploading(false);
    setIsUploaded(false);
    setIsSending(false);
    setUploadedConcepts(new Array<Concept>());
    modalRef.current?.close();
  };

  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <Button variant={'secondary'}>
          <FileImportIcon />
          Importer
        </Button>
      </Modal.Trigger>
      <Modal.Dialog
        ref={modalRef}
        onInteractOutside={() => modalRef.current?.close()}
      >
        <Modal.Header className={styles.content}>
          <Markdown>{localization.concept.importModal.title}</Markdown>
        </Modal.Header>
        <Modal.Content className={styles.content}>
          <div className={styles.modalContent}>
            {(isUploading || isSending) && (
              <div className={styles.spinnerOverlay}>
                <Spinner
                  title={localization.loading}
                  size='large'
                />
              </div>
            )}
            <Markdown>{localization.concept.importModal.conceptUploadDescription}</Markdown>
            <br />
            <Markdown>{localization.concept.importModal.resultDescription}</Markdown>
            <br />
            <div className={styles.remark}>
              <Markdown>{localization.concept.importModal.maxFileSize}</Markdown>
            </div>
            <div className={styles.warning}>
              <Markdown>{localization.concept.importModal.csvImportHistoryNotSupported}</Markdown>
            </div>
          </div>
        </Modal.Content>
        {!(isUploading || isSending || isUploaded) && (
          <Modal.Footer>
            <div className={styles.buttons}>
              <>
                <LinkButton
                  href={`/catalogs/${catalogId}/concepts/import-results`}
                  variant={'secondary'}
                >
                  Resultater
                </LinkButton>

                <UploadButton
                  size='sm'
                  allowedMimeTypes={[
                    'text/csv',
                    'text/x-csv',
                    'text/plain',
                    'application/csv',
                    'application/x-csv',
                    'application/vnd.ms-excel',
                    'application/json',
                  ]}
                  onUpload={onImportUpload}
                >
                  <FileImportIcon fontSize='1.5rem' />
                  <span>{localization.button.importConceptCSV}</span>
                </UploadButton>

                <ImportConceptRdf
                  catalogId={catalogId}
                  setIsLoading={setIsUploading}
                />
              </>
            </div>
          </Modal.Footer>
        )}
        {isUploaded && !isSending && (
          <Modal.Footer>
            <div className={styles.buttons}>
              <Button
                variant={'secondary'}
                onClick={cancel}
              >
                Avbryt
              </Button>
              <Button
                onClick={send}
                variant={'primary'}
              >
                <TasklistSendIcon />
                Send
              </Button>
            </div>
          </Modal.Footer>
        )}
      </Modal.Dialog>
    </Modal.Root>
  );
}

export default ImportModal;