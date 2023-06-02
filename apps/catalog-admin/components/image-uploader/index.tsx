import { useEffect, useState } from 'react';
import styles from './image-uploader.module.css';
import { useAdminDispatch } from 'apps/catalog-admin/context/admin';
import { Button } from '@catalog-frontend/ui';
import { FileImportIcon, TrashIcon } from '@navikt/aksel-icons';

const allowedFileTypes = ['image/x-png', 'image/svg+xml'];
export function ImageUploader() {
  const [image, setImage] = useState<string>(null);
  const [fileName, setFileName] = useState<string>(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setFileName(event.target.files[0].name);
    }
  };

  const adminDispatch = useAdminDispatch();
  useEffect(() => adminDispatch({ type: 'SET_LOGO', payload: { logo: image } }), [image]);
  console.log('Logo-imageuploader:', image);

  return (
    <>
      <div className={styles.container}>
        {fileName && (
          <div className={styles.filename}>
            <div className={styles.file}>{fileName}</div>
            <TrashIcon
              title='a11y-title'
              onClick={() => {
                setFileName(null);
                setImage(null);
              }}
            />
          </div>
        )}

        <label
          className={styles.label}
          htmlFor='file-upload'
          aria-haspopup='true'
          aria-expanded='true'
          tabIndex={0}
        >
          <FileImportIcon
            title='a11y-title'
            fontSize='1.5rem'
          />
          <div>Import logo</div>
        </label>
        <input
          id='file-upload'
          type='file'
          accept={allowedFileTypes.join(', ')}
          onChange={onImageChange}
          className={styles.input}
          aria-label={'test'}
          aria-required='true'
          name='file-upload'
        />
      </div>
    </>
  );
}

export default ImageUploader;
