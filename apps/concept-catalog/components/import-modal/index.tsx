import React, { useRef } from 'react';
import { localization as loc, localization } from '@catalog-frontend/utils';
import { LinkButton, TitleWithHelpTextAndTag, UploadButton } from '@catalog-frontend/ui';
import { useImportConcepts } from '../../hooks/import';
import { Button, Modal } from '@digdir/designsystemet-react';
import styles from './import-modal.module.scss';
import { FileImportIcon } from '@navikt/aksel-icons';
import { ImportConceptRdf } from './concept-rdf-upload';

interface Props {
  catalogId: string;
}

export function ImportModal({ catalogId }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);

  const importConcepts = useImportConcepts(catalogId);

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
        <Modal.Header>
          <TitleWithHelpTextAndTag>{localization.dataServiceCatalog.importModal.title}</TitleWithHelpTextAndTag>
        </Modal.Header>
        <Modal.Content>
          <div>{localization.dataServiceCatalog.importModal.openapiDescription}</div>
          <div>{localization.dataServiceCatalog.importModal.resultDescription}</div>
        </Modal.Content>
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
                  <span>{loc.button.importConcept}</span>
                </UploadButton>

                <ImportConceptRdf catalogId={catalogId} />
              </>
          </div>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal.Root>
  );
}

export default ImportModal;