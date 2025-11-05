import React, { useRef, useState } from "react";
import { localization } from "@catalog-frontend/utils";
import { UploadButton } from "@catalog-frontend/ui";
import {
  useImportConceptsCSV,
  useSendConcepts,
  useImportRdf,
  useSendRdf,
} from "../../hooks/import";
import { Button, Modal, Spinner } from "@digdir/designsystemet-react";
import styles from "./import-modal.module.scss";
import { FileImportIcon, TasklistSendIcon } from "@navikt/aksel-icons";
import Markdown from "react-markdown";
import { Concept } from "@catalog-frontend/types";
import { HelpMarkdown } from "@catalog-frontend/ui";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface ImportProps {
  catalogId: string;
}

interface ImportRdfProps {
  catalogId: string;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsUploaded: React.Dispatch<React.SetStateAction<boolean>>;
}

enum UploadType {
  CSV = "CSV",
  RDF = "RDF",
}

export interface UploadRdfProps {
  fileContent: string;
  contentType: string;
}

export function ImportModal({ catalogId }: ImportProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [cancelled, setCancelled] = useState<boolean>(false);
  const [isGoingtoImportResults, setIsGoingtoImportResults] =
    useState<boolean>(false);
  let uploadSession;
  const sessionId = useRef<number>(0);

  const [uploadType, setUploadType] = useState<UploadType>(UploadType.CSV);
  const [uploadedConcepts, setUploadedConcepts] = useState<Array<Concept>>(
    new Array<Concept>(),
  );
  const [uploadedRdfConcepts, setUploadedRdfConcepts] =
    useState<UploadRdfProps>({} as UploadRdfProps);

  const modalRef = useRef<HTMLDialogElement>(null);
  const readerRdfRef = useRef<FileReader | null>(null);

  const uploadConcepts = useImportConceptsCSV(
    catalogId,
    setIsUploading,
    setIsUploaded,
  );
  const sendConcepts = useSendConcepts(catalogId);

  const uploadRdf = useImportRdf(catalogId);
  const sendRdf = useSendRdf(catalogId);
  const resultsPageMutation = useMutation({
    mutationFn: async () =>
      await router.push(`/catalogs/${catalogId}/concepts/import-results`),
    onError: (error) =>
      console.error("Failed to go to import results page", error),
  });

  const maxSize = 10; // 10 MB

  const onCsvUpload = (event) => {
    const file: File = event.target.files?.[0];
    if (file) {
      if (file.size > maxSize * 1024 * 1024) {
        alert(
          localization.formatString(
            localization.alert.maxFileSizeExceeded,
            maxSize,
          ),
        );
        cancel();
        return;
      }

      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (fileExtension != "csv" && fileExtension != "json") {
        alert(
          localization.formatString(
            localization.concept.importModal.alert.unsupportedFileUpload,
            "CSV/JSON",
          ),
        );
        cancel();
        return;
      }

      uploadConcepts.mutate(event.target.files[0], {
        onSuccess: (concepts) => {
          setUploadedConcepts(concepts);
          setIsUploading(false);
          setUploadType(UploadType.CSV);
        },
        onError: (error) => alert("Import failed: " + error),
      });
    }
  };

  const send = async () => {
    setIsSending(true);

    if (uploadType === UploadType.CSV) sendConcepts.mutate(uploadedConcepts);
    else if (uploadType === UploadType.RDF) {
      console.log("Uploaded concepts: ", uploadedRdfConcepts);
      sendRdf.mutate(uploadedRdfConcepts);
    }
  };

  const cancel = () => {
    console.log("Reader aborting: ", readerRdfRef?.current);
    readerRdfRef?.current?.abort();
    readerRdfRef.current = null;
    setIsUploading(false);
    setIsGoingtoImportResults(false);
    setIsUploaded(false);
    setIsSending(false);
    setCancelled(false);
    setUploadedConcepts(new Array<Concept>());
    setUploadedRdfConcepts({} as UploadRdfProps);
    modalRef.current?.close();
    sessionId.current = 0;
    uploadSession = null;
  };

  const ImportConceptRdf = ({
    catalogId,
    setIsUploading,
    setIsUploaded,
  }: ImportRdfProps) => {
    const extension2Type: Map<string, string> = new Map<string, string>();
    extension2Type.set(".ttl", "text/turtle");
    const allowedExtensions = Array.from(extension2Type.keys());
    const onFileUpload = (event) => {
      setCancelled(false);
      setIsUploading(true);
      //await new Promise(resolve => setTimeout(resolve, 5000));
      const file: File = event.target.files?.[0];
      if (file) {
        if (file.size > maxSize * 1024 * 1024) {
          alert(
            localization.formatString(
              localization.alert.maxFileSizeExceeded,
              maxSize,
            ),
          );
          cancel();
          return;
        }
        const reader = new FileReader();
        readerRdfRef.current = reader;
        reader.readAsText(file, "UTF-8");
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        const contentType = extension2Type.get(`.${fileExtension}`);
        if (!fileExtension || !contentType || fileExtension != "ttl") {
          console.error(
            "Uploaded file has no extension or unsupported extension:",
            fileExtension,
          );
          alert(
            localization.formatString(
              localization.concept.importModal.alert.unsupportedFileUpload,
              "RDF/Turtle",
            ),
          );
          cancel();
          return;
        }

        reader.onload = function (evt) {
          if (uploadSession !== sessionId.current || cancelled) {
            console.log("Session ID", sessionId);
            console.log("Upload session", uploadSession);
            console.log(
              "Will not upload, sessionId does not match or upload was cancelled",
            );
            return;
          }
          if (evt.target && typeof evt.target.result === "string") {
            uploadRdf.mutate({
              fileContent: evt.target.result,
              contentType: contentType,
            });
            setUploadType(UploadType.RDF);
            setUploadedRdfConcepts({
              fileContent: evt.target.result,
              contentType: contentType,
            } as UploadRdfProps);
            setIsUploaded(true);
            setIsUploading(false);
          } else {
            console.error("File content is not a string");
            setIsUploading(false);
          }
        };
      }
    };

    return (
      <UploadButton
        disabled={isGoingtoImportResults || isUploading}
        allowedMimeTypes={allowedExtensions}
        onUpload={(e) => {
          sessionId.current = Date.now();
          uploadSession = sessionId.current;
          onFileUpload(e);
        }}
      >
        <FileImportIcon fontSize="1.5rem" />
        <span>{localization.button.importConceptRDF}</span>
      </UploadButton>
    );
  };

  const goToImporResults = () => {
    setIsGoingtoImportResults(true);
    resultsPageMutation.mutate();
  };

  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <Button variant={"secondary"}>
          <FileImportIcon />
          Importer
        </Button>
      </Modal.Trigger>
      <Modal.Dialog
        ref={modalRef}
        onClose={() => {
          cancel();
          modalRef.current = null;
        }}
      >
        {!isUploading && !isSending && !isUploaded && (
          <>
            <Modal.Header className={styles.content}>
              <div className={styles.titleTags}>
                <Markdown>{localization.concept.importModal.title}</Markdown>
                <HelpMarkdown
                  aria-label={`Help ${localization.concept.importModal.titleHelpText}`}
                >
                  {localization.concept.importModal.titleHelpText}
                </HelpMarkdown>
              </div>
            </Modal.Header>
            <Modal.Content className={styles.content}>
              <div className={styles.modalContent}>
                {(isGoingtoImportResults || isUploading || isSending) && (
                  <div className={styles.spinnerOverlay}>
                    <Spinner title={localization.loading} size="large" />
                  </div>
                )}
                <div className={styles.markdownContent}>
                  <Markdown>
                    {localization.concept.importModal.conceptUploadDescription}
                  </Markdown>
                </div>
                <div className={styles.remark}>
                  <div className={styles.markdownContent}>
                    <Markdown>
                      {localization
                        .formatString(
                          localization.concept.importModal.maxFileSize,
                          maxSize,
                        )
                        .toString()}
                    </Markdown>
                  </div>
                </div>
              </div>
            </Modal.Content>
          </>
        )}

        {(isUploading || isUploaded || isSending) && (
          <>
            <Modal.Header className={styles.content}>
              <Markdown>
                {localization.concept.importModal.titleConfirmSending}
              </Markdown>
            </Modal.Header>
            <Modal.Content className={styles.content}>
              <div className={styles.modalContent}>
                {(isUploading || isSending) && (
                  <div className={styles.spinnerOverlay}>
                    <Spinner title={localization.loading} size="large" />
                  </div>
                )}
                <div className={styles.markdownContent}>
                  <Markdown>
                    {localization.concept.importModal.textConfirmSending}
                  </Markdown>
                </div>
              </div>
            </Modal.Content>
          </>
        )}

        {!isUploading && !isSending && !isUploaded && (
          <Modal.Footer>
            <div className={styles.buttons}>
              <>
                <Button
                  variant={"secondary"}
                  disabled={isGoingtoImportResults || isUploading}
                  onClick={goToImporResults}
                >
                  Resultater
                </Button>

                <UploadButton
                  disabled={isGoingtoImportResults || isUploading}
                  size="sm"
                  allowedMimeTypes={[
                    "text/csv",
                    "text/x-csv",
                    "text/plain",
                    "application/csv",
                    "application/x-csv",
                    "application/vnd.ms-excel",
                    "application/json",
                  ]}
                  onUpload={onCsvUpload}
                >
                  <FileImportIcon fontSize="1.5rem" />
                  <span>{localization.button.importConceptCSV}</span>
                </UploadButton>

                <ImportConceptRdf
                  catalogId={catalogId}
                  setIsUploading={setIsUploading}
                  setIsUploaded={setIsUploaded}
                />
              </>
            </div>
          </Modal.Footer>
        )}
        {(isUploading || isUploaded || isSending) && (
          <Modal.Footer>
            <div className={styles.buttons}>
              <Button
                onClick={send}
                disabled={isUploading || isSending}
                variant={"primary"}
              >
                <TasklistSendIcon />
                Fortsett
              </Button>
              <Button
                variant={"secondary"}
                onClick={cancel}
                disabled={isSending}
              >
                Avbryt
              </Button>
            </div>
          </Modal.Footer>
        )}
      </Modal.Dialog>
    </Modal.Root>
  );
}
