'use client';

import { ChangeEvent, FC, useId, useRef } from 'react';
import { ButtonProps } from '@digdir/design-system-react';
import { Button } from './button';

export interface UploadButtonProps extends ButtonProps {
  allowedMimeTypes?: string[];
  onUpload?: (event: ChangeEvent) => void;
}

const UploadButton: FC<UploadButtonProps> = ({ children, allowedMimeTypes, onUpload, ...props }: any) => {
  const ref = useRef<HTMLInputElement>(null);
  const buttonId = useId();

  return (
    <>
      <Button
        {...props}
        id={buttonId}
        aria-controls={ref.current?.id}
        aria-haspopup='true'
        onClick={() => {
          if (ref.current) {
            ref.current.value = '';
            ref.current.click();
          }
        }}
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

export { UploadButton };
