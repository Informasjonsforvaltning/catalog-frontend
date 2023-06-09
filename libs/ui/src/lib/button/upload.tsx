import { ChangeEvent, FC, useId, useRef } from 'react';
import { ButtonProps } from '@digdir/design-system-react';
import Button from './button';

export interface Props extends ButtonProps {
  allowedMimeTypes?: string[];
  onUpload?: (event: ChangeEvent) => void;
}

export const UploadButton: FC<Props> = ({ children, allowedMimeTypes, onUpload, ...props }: any) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        {...props}
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
      />
    </>
  );
};

export default UploadButton;
