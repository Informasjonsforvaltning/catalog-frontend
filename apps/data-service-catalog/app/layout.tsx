import {
  AuthSessionModal,
  NextAuthProvider,
  ReactQueryClientProvider,
} from "@catalog-frontend/ui-v2";
import { authOptions, localization } from "@catalog-frontend/utils";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { NuqsAdapter } from "nuqs/adapters/react";

export const metadata: Metadata = {
  title: localization.catalogType.dataService,
  description: localization.catalogType.dataService,
};

const RootLayout = async (props: LayoutProps<"/">) => {
  const session = await getServerSession(authOptions);

  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider session={session}>
          <AuthSessionModal storageKey="dataServiceForm" />
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
