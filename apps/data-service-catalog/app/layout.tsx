import { NextAuthProvider, ReactQueryClientProvider } from '@catalog-frontend/ui';
import { localization } from '@catalog-frontend/utils';
import { Metadata } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: localization.catalogType.dataService,
  description: localization.catalogType.dataService,
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider>
          <NuqsAdapter>
            <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
          </NuqsAdapter>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
