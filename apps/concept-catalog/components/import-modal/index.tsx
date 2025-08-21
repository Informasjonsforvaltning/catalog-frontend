import React, { useRef, useState } from 'react';
import { localization as loc, localization } from '@catalog-frontend/utils';
import { LinkButton, UploadButton, MarkdownComponent } from '@catalog-frontend/ui';
import { useImportConcepts } from '../../hooks/import';
import { Button, Modal, Spinner } from '@digdir/designsystemet-react';
import styles from './import-modal.module.scss';
import { FileImportIcon } from '@navikt/aksel-icons';
import { ImportConceptRdf } from './concept-rdf-upload';

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
          <MarkdownComponent>{localization.concept.importModal.title}</MarkdownComponent>
        </Modal.Header>
        <Modal.Content className={styles.content}>
          <div className={styles.modalContent}>
            <MarkdownComponent>{localization.concept.importModal.conceptUploadDescription}</MarkdownComponent>
            <br />
            <MarkdownComponent>{localization.concept.importModal.resultDescription}</MarkdownComponent>
            <br />
            <div className={styles.remark}>
              <MarkdownComponent>{localization.concept.importModal.maxFileSize}</MarkdownComponent>
            </div>
            <div className={styles.warning}>
              <MarkdownComponent>{localization.concept.importModal.csvImportHistoryNotSupported}</MarkdownComponent>
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
                  <span>{loc.button.importConcept}</span>
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