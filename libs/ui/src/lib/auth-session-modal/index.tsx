"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Modal, Paragraph } from "@digdir/designsystemet-react";
import {
  LocalDataStorage,
  localization,
  isSessionValid,
} from "@catalog-frontend/utils";
import { useRouter, usePathname } from "next/navigation";

type AuthSessionModalProps = {
  signInPath?: string;
  storageKey?: string;
};

export const AuthSessionModal = ({
  signInPath = "/auth/signin",
  storageKey,
}: AuthSessionModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const pathName = usePathname();
  const router = useRouter();

  const storage = storageKey
    ? new LocalDataStorage<any>({ key: storageKey })
    : undefined;
  const [hasStorageData, setHasStorageData] = useState(false);

  const validateAuth = async () => {
    return await isSessionValid();
  };

  const handleLoginClick = () => {
    if (pathName.includes(signInPath)) {
      return (window.location.href = signInPath);
    } else {
      // Use relative path (pathname + search) instead of full URL
      const callbackUrl = window.location.pathname + window.location.search;
      return router.push(
        `${signInPath}?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
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
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Modal ref={modalRef}>
      <Modal.Header closeButton={false}>
        {localization.auth.sessionExpiredTitle}
      </Modal.Header>
      <Modal.Content>
        <Paragraph size="sm">
          {hasStorageData
            ? localization.auth.sessionExpiredWithStorage
            : localization.auth.sessionExpired}
        </Paragraph>
      </Modal.Content>
      <Modal.Footer>
        <Button size="sm" onClick={handleLoginClick}>
          {localization.auth.login}
        </Button>
        <Button size="sm" variant="secondary" onClick={handleCancelClick}>
          {localization.button.cancel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
