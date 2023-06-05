import { useEffect, useState } from 'react';
import styles from './image-uploader.module.css';
import { useAdminDispatch } from '../../context/admin';
import { FileImportIcon, TrashIcon } from '@navikt/aksel-icons';
import { localization } from '@catalog-frontend/utils';

const allowedFileTypes = ['image/x-png', 'image/svg+xml'];
export function ImageUploader() {
  const [image, setImage] = useState<string>(undefined);
  const [fileName, setFileName] = useState<string>(undefined);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setFileName(event.target.files[0].name);
    }
  };

  const adminDispatch = useAdminDispatch();
  useEffect(() => adminDispatch({ type: 'SET_LOGO', payload: { logo: image } }), [image]);

  return (
    <>
      <div className={styles.container}>
        {fileName && (
          <div className={styles.filename}>
            <div className={styles.file}>{fileName}</div>
            <TrashIcon
              title={localization.button.bin}
              onClick={() => {
                setFileName(undefined);
                setImage(undefined);
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
          <FileImportIcon fontSize='1.5rem' />
          <div>{localization.button.importLogo}</div>
        </label>
        <input
          id='file-upload'
          type='file'
          accept={allowedFileTypes.join(', ')}
          onChange={onImageChange}
          className={styles.input}
        />
      </div>
    </>
  );
}

export default ImageUploader;
