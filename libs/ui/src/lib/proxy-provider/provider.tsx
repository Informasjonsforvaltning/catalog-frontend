'use client';

import { localization } from '@catalog-frontend/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { FC, PropsWithChildren, createContext, useEffect, useState } from 'react';

export const ProxyContext = createContext<ProxyInstance>([undefined, () => null]);

export const ProxyProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [tips, setTips] = useState<string | undefined>();
  const msg = tips === undefined ? tips : tips || localization.alert.unsavedChanges;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const url = [pathname, searchParams].filter((i) => i).join('?');
  useEffect(() => {
    setTips(undefined);
  }, [url, setTips]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (msg === undefined) return msg;

      event.preventDefault();
      event.returnValue = msg;

      return msg;
    };

    const script = document.getElementById('proxy-script');
    if (script) {
      script.dataset.msg = msg || '';
      // eslint-disable-next-line no-restricted-globals
      script.dataset.href = location.href;
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [msg]);

  return (
    <ProxyContext.Provider value={[msg, setTips]}>
      <Script
        strategy='afterInteractive'
        id='proxy-script'
        dangerouslySetInnerHTML={{
          __html: `(() => {
            const originalPushState = history.pushState.bind(history);
            let currentPoint = 0;
            let point = 0;
            window.history.pushState = function(state, title, url) {
                state.point = ++point;
                currentPoint = point;
                originalPushState(state, title, url);
            };
            const originalReplaceState = history.replaceState.bind(history);
            window.history.replaceState = function(state, title, url) {
                state.point = currentPoint;
                originalReplaceState(state, title, url);
            };
            window.addEventListener('popstate', function (event) {
                const { state: nextState } = event;
                const isback = currentPoint > nextState.point;

                currentPoint = nextState.point;

                const script = document.getElementById('proxy-script');
                if (!script || location.href === script.dataset.href) return;

                const msg = script.dataset.msg||'';
                const confirm = msg == '' ? true : window.confirm(msg);
                if (!confirm) {
                    event.stopImmediatePropagation();
                    isback ? history.forward() : history.back();
                }
            });
        })()`,
        }}
      ></Script>
      {children}
    </ProxyContext.Provider>
  );
};

export type ProxyInstance = [string | undefined, (tips?: string) => void];
