import {
  AuthSessionModal,
  NextAuthProvider,
  ReactQueryClientProvider,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/react";

export const metadata: Metadata = {
  title: localization.catalogType.dataset,
  description: localization.catalogType.dataset,
};

const RootLayout = (props: LayoutProps<"/">) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider>
          <AuthSessionModal storageKey="datasetForm" />
          <NuqsAdapter>
            <ReactQueryClientProvider>
              {props.children}
            </ReactQueryClientProvider>
          </NuqsAdapter>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
