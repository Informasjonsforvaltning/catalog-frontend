import {
  AuthSessionModal,
  NextAuthProvider,
  ReactQueryClientProvider,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: localization.catalogType.service,
  description: localization.catalogType.service,
};

const RootLayout = (props: LayoutProps<"/">) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider>
          <AuthSessionModal storageKey="serviceForm" />
          <ReactQueryClientProvider>{props.children}</ReactQueryClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
