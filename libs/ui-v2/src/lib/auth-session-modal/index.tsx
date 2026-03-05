"use client";

import { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  Heading,
  Paragraph,
} from "@digdir/designsystemet-react";
import {
  LocalDataStorage,
  localization,
  isSessionValid,
} from "@catalog-frontend/utils";
import { useRouter, usePathname } from "next/navigation";
import { DialogActions } from "@catalog-frontend/ui-v2";
import styles from "./auth-session-modal.module.css";

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
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Dialog ref={modalRef}>
      <Heading className={styles.heading} data-size="xs">
        {localization.auth.sessionExpiredTitle}
      </Heading>
      <Paragraph data-size="sm" className={styles.paragraph}>
        {hasStorageData
          ? localization.auth.sessionExpiredWithStorage
          : localization.auth.sessionExpired}
      </Paragraph>
      <DialogActions>
        <Button data-size="sm" onClick={handleLoginClick}>
          {localization.auth.login}
        </Button>
        <Button data-size="sm" variant="secondary" onClick={handleCancelClick}>
          {localization.button.cancel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
