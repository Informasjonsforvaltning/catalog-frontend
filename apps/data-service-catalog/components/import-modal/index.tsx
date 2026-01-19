import React, { useRef, useState } from "react";
import { localization } from "@catalog-frontend/utils";
import {
  LinkButton,
  TitleWithHelpTextAndTag,
  UploadButton,
} from "@catalog-frontend/ui";
import { useImport } from "../../hooks/import";
import { Button, Dialog, Spinner } from "@digdir/designsystemet-react";
import styles from "./import-modal.module.scss";
import { FileImportIcon } from "@navikt/aksel-icons";

const allowedFileTypes = [".json", ".yaml", ".yml"];

interface Props {
  catalogId: string;
}

export function ImportModal({ catalogId }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const uploadYaml = useImport(catalogId, "application/yaml");
  const uploadJson = useImport(catalogId, "application/json");

  const onFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (evt) {
        if (evt.target && typeof evt.target.result === "string") {
          setIsLoading(true);
          if (file.name.split(".").pop() === "json") {
            uploadJson.mutate(evt.target.result);
          } else {
            uploadYaml.mutate(evt.target.result);
          }
        }
      };
    }
  };

  return (
    <Dialog.TriggerContext>
      <Dialog.Trigger asChild>
        <Button variant={"secondary"} size="small">
          <FileImportIcon fontSize="1.5rem" />
          Import
        </Button>
      </Dialog.Trigger>
      <Dialog
        ref={modalRef}
        onInteractOutside={() => modalRef.current?.close()}
      >
        <Dialog.Block>
          <TitleWithHelpTextAndTag>
            {localization.dataServiceCatalog.importModal.title}
          </TitleWithHelpTextAndTag>
        </Dialog.Block>
        <Dialog.Block>
          <div>
            {localization.dataServiceCatalog.importModal.openapiDescription}
          </div>
          <div>
            {localization.dataServiceCatalog.importModal.resultDescription}
          </div>
        </Dialog.Block>
        <Dialog.Block>
          <div className={styles.buttons}>
            {isLoading ? (
              <Spinner title={localization.loading} size="large" />
            ) : (
              <>
                <LinkButton
                  href={`/catalogs/${catalogId}/data-services/import-results`}
                  variant={"secondary"}
                >
                  Resultater
                </LinkButton>
                <UploadButton
                  allowedMimeTypes={allowedFileTypes}
                  onUpload={(e) => onFileChange(e)}
                >
                  {localization.button.importDataService}
                </UploadButton>
              </>
            )}
          </div>
        </Dialog.Block>
      </Dialog>
    </Dialog.TriggerContext>
  );
}

export default ImportModal;
