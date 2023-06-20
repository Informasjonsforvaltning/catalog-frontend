import { ChangeEvent, FC, useId, useRef } from 'react';
import { ButtonProps } from '@digdir/design-system-react';
import Button from './button';
import styles from './upload.module.scss';

export interface Props extends ButtonProps {
  allowedMimeTypes?: string[];
  onUpload?: (event: ChangeEvent) => void;
}

export const UploadButton: FC<Props> = ({ children, allowedMimeTypes, onUpload, ...props }: any) => {
  const ref = useRef<HTMLInputElement>(null);
  const buttonId = useId();

  return (
    <>
      <Button
        {...props}
        id={buttonId}
        aria-controls={ref.current?.id}
        aria-haspopup='true'
        onClick={() => ref.current?.click()}
      >
        {children}
      </Button>
      <input
        ref={ref}
        type='file'
        accept={allowedMimeTypes?.join(', ')}
        onChange={onUpload}
        hidden
        aria-labelledby={buttonId}
      />
    </>
  );
};

export default UploadButton;
