'use client';

import { useRouter as useRouterRaw } from 'next/navigation';
import { useContext } from 'react';
import { ProxyContext } from './index';

export const useRouter = () => {
  const [tips] = useContext(ProxyContext);
  const router = useRouterRaw();

  return new Proxy(router, {
    get: function (target, propKey) {
      const confirm = tips === undefined ? true : window.confirm(tips);
      return confirm ? target[propKey as RouterKey] : () => null;
    },
  });
};

type RouterKey = keyof ReturnType<typeof useRouterRaw>;
