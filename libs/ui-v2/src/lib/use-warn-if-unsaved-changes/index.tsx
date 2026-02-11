"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { localization } from "@catalog-frontend/utils";
// TODO: Implement this hook properly if we have any other option like router events
// or interceptors

const clickType =
  typeof document !== "undefined" && document.ontouchstart
    ? "touchstart"
    : "click";

const confirmationMessage = localization.alert.unsavedChanges;

interface Props {
  enabled?: boolean;
  unsavedChanges: boolean;
}

const useWarnIfUnsavedChanges = ({ enabled = true, unsavedChanges }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const beforeUnloadHandler = useCallback(
    (event: BeforeUnloadEvent) => {
      unsavedChanges && event.preventDefault();
    },
    [unsavedChanges],
  );

  const clickHandler = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if ((event as MouseEvent).button || event.which !== 1) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const target = event.target as HTMLElement;
      if (target.tagName !== "A") {
        return;
      }

      const newPath = target.getAttribute("href");
      if (newPath && newPath !== window.location.pathname && unsavedChanges) {
        event.preventDefault();
        // NOTE: There is an option to show standard beforeunload dialog here by
        // actually assigning window.location.href to newPath. That will be more
        // consistent, but will cause full page reload in case of the user decides to
        // go back.
        // window.location.href = newPath; // This will show the standard dialog
        if (window.confirm(confirmationMessage)) {
          router.push(newPath);
        }
      }
    },
    [router, unsavedChanges],
  );

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("beforeunload", beforeUnloadHandler);
    window.document.addEventListener(clickType, clickHandler, {
      capture: true,
    });
    return () => {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      window.document.removeEventListener(clickType, clickHandler, {
        capture: true,
      });
    };
  }, [beforeUnloadHandler, clickHandler, pathname, searchParams, enabled]);
};

export { useWarnIfUnsavedChanges };
