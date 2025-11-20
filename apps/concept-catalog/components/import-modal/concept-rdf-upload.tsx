import { UploadButton } from "@catalog-frontend/ui";
import { FileImportIcon } from "@navikt/aksel-icons";
import { localization } from "@catalog-frontend/utils";
import { useImportRdf } from "@concept-catalog/hooks/import";
import { Dispatch, SetStateAction } from "react";

interface Props {
  catalogId: string;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const ImportConceptRdf = ({ catalogId, setIsLoading }: Props) => {
  const extension2Type: Map<string, string> = new Map<string, string>();
  extension2Type.set(".ttl", "text/turtle");
  const allowedExtensions = Array.from(extension2Type.keys());
  const uploadRdf = useImportRdf(catalogId);
  const onFileUpload = async (event: any) => {
    const file: File = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const contentType = extension2Type.get(`.${fileExtension}`);
      if (!fileExtension || !contentType) {
        console.error(
          "Uploaded file has no extension or unsupported extension:",
          fileExtension,
        );
        return;
      }
      reader.onload = function (evt) {
        if (evt.target && typeof evt.target.result === "string") {
          setIsLoading(true);
          uploadRdf.mutate({
            fileContent: evt.target.result,
            contentType: contentType,
          });
        } else {
          console.error("File content is not a string");
          setIsLoading(false);
        }
      };
    }
  };

  return (
    <UploadButton allowedMimeTypes={allowedExtensions} onUpload={onFileUpload}>
      <FileImportIcon fontSize="1.5rem" />
      <span>{localization.button.importConceptRDF}</span>
    </UploadButton>
  );
};

export default ImportConceptRdf;
