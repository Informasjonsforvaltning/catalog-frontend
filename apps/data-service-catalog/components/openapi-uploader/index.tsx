import React from 'react';
import { localization } from '@catalog-frontend/utils';
import styles from './openapi-uploader.module.css';
import { UploadButton } from '@catalog-frontend/ui';
import { useImport } from '../../hooks/import';

const allowedFileTypes = ['application/json', 'application/yaml', 'application/x-yaml'];

interface Props {
  catalogId: string;
}

export function OpenapiUploader({ catalogId }: Props) {
  const uploadYaml = useImport(catalogId, 'application/yaml');
  const uploadJson = useImport(catalogId, 'application/json');

  const onFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = function (evt) {
        if (evt.target && typeof evt.target.result === 'string') {
          if (file.name.split('.').pop() === 'json') {
            uploadJson.mutate(evt.target.result);
          } else {
            uploadYaml.mutate(evt.target.result);
          }
        }
      };
    }
  };

  return (
    <div className={styles.container}>
      <UploadButton
        allowedMimeTypes={allowedFileTypes}
        onUpload={(e) => {
          onFileChange(e);
        }}
      >
        {localization.button.importDataService}
      </UploadButton>
    </div>
  );
}

export default OpenapiUploader;
