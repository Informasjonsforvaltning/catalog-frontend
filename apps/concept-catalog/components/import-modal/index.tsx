import React, { useRef, useState } from 'react';
import { localization } from '@catalog-frontend/utils';
import { LinkButton, UploadButton } from '@catalog-frontend/ui';
import { useImportConcepts } from '../../hooks/import';
import { Button, Modal, Spinner } from '@digdir/designsystemet-react';
import styles from './import-modal.module.scss';
import { FileImportIcon } from '@navikt/aksel-icons';
import { ImportConceptRdf } from './concept-rdf-upload';
import Markdown from 'react-markdown';

interface Props {
  catalogId: string;
}

export function ImportModal({ catalogId }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDialogElement>(null);

  const importConcepts = useImportConcepts(catalogId, setIsLoading);

  const onImportUpload = (event) => {
    importConcepts.mutate(event.target.files[0], { onError: (error) => alert('Import failed: ' + error) });
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
        <Modal.Footer>
          <div className={styles.buttons}>
            {isLoading ? (
              <Spinner
                title={localization.loading}
                size='large'
              />
            ) : (
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
                  <span>{localization.button.importConcept}</span>
                </UploadButton>

                <ImportConceptRdf
                  catalogId={catalogId}
                  setIsLoading={setIsLoading}
                />
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal.Root>
  );
}

export default ImportModal;