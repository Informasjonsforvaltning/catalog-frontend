'use client';

import { useEffect, useRef, useState } from 'react';
import { Button, Dialog, Paragraph } from '@digdir/designsystemet-react';
import { HStack } from '@fellesdatakatalog/ui';
import { LocalDataStorage, localization } from '@catalog-frontend/utils';
import { useRouter, usePathname } from 'next/navigation';

type AuthSessionModalProps = {
  validatePath?: string;
  signInPath?: string;
  storageKey?: string;
};

export const AuthSessionModal = ({
  validatePath = '/api/auth/validate',
  signInPath = '/auth/signin',
  storageKey,
}: AuthSessionModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const pathName = usePathname();
  const router = useRouter();

  const storage = storageKey ? new LocalDataStorage<any>({ key: storageKey }) : undefined;
  const [hasStorageData, setHasStorageData] = useState(false);

  const validateAuth = async () => {
    const res = await fetch(validatePath);
    return res.status === 200;
  };

  const handleLoginClick = () => {
    if (pathName.includes(signInPath)) {
      return (window.location.href = signInPath);
    } else {
      return router.push(`${signInPath}?callbackUrl=${window.location.href}`);
    }
  };

  const handleCancelClick = () => {
    modalRef.current?.close();
  };

  useEffect(() => {
    setHasStorageData(storage?.get());

    const interval = setInterval(() => {
      validateAuth().then((valid) => {
        if (!valid) {
          modalRef.current?.showModal();
          clearInterval(interval);
        }
      });
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Dialog ref={modalRef}>
      <Dialog.Block>{localization.auth.sessionExpiredTitle}</Dialog.Block>
      <Dialog.Block>
        <Paragraph>
          {hasStorageData ? localization.auth.sessionExpiredWithStorage : localization.auth.sessionExpired}
        </Paragraph>
      </Dialog.Block>
      <Dialog.Block>
        <HStack>
          <Button
            data-size='sm'
            onClick={handleLoginClick}
          >
            {localization.auth.login}
          </Button>
          <Button
            data-size='sm'
            variant='secondary'
            onClick={handleCancelClick}
          >
            {localization.button.cancel}
          </Button>
        </HStack>
      </Dialog.Block>
    </Dialog>
  );
};
