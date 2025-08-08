import { UploadButton } from '@catalog-frontend/ui';
import { FileImportIcon } from '@navikt/aksel-icons';
import { localization } from '@catalog-frontend/utils';
import React from 'react';
import { useImportRdfConcepts } from '@concept-catalog/hooks/import';


interface Props {
  catalogId: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  abortSignal: AbortSignal;
}

export const ImportConceptRdf = ( { catalogId, setIsLoading, abortSignal }: Props) => {

  const extension2Type: Map<string, string> = new Map<string, string>();
  extension2Type.set('.ttl', 'text/turtle');
  const allowedExtensions = Array.from(extension2Type.keys());
  const uploadRdf = useImportRdfConcepts(catalogId, abortSignal);
  const onFileUpload = async (event) => {
    const file: File = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const contentType = extension2Type.get(`.${fileExtension}`);
      if (!fileExtension || ! contentType) {
        console.error('Uploaded file has no extension or unsupported extension:', fileExtension);
        return;
      }
      reader.onload = function (evt) {
        if (evt.target && typeof evt.target.result === 'string') {
            setIsLoading(true);
            uploadRdf.mutate({fileContent: evt.target.result, contentType: contentType });
        } else {
          console.error('File content is not a string');
          setIsLoading(false);
        }
      };
    }
  }

  return (
    <UploadButton
      allowedMimeTypes={allowedExtensions}
      onUpload={(e) => onFileUpload(e)}
    >
      <FileImportIcon fontSize='1.5rem' />
      <span>{localization.button.importConceptRDF}</span>
    </UploadButton>
  );
};

export default ImportConceptRdf;