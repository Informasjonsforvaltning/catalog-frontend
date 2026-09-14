import {
  AuthSessionModal,
  NextAuthProvider,
  ReactQueryClientProvider,
} from "@catalog-frontend/ui";
import { authOptions, localization } from "@catalog-frontend/utils";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { NuqsAdapter } from "nuqs/adapters/react";

export const metadata: Metadata = {
  title: localization.catalogType.informationModel,
  description: localization.catalogType.informationModel,
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider session={session}>
          <AuthSessionModal storageKey="informationModelForm" />
          <NuqsAdapter>
            <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
          </NuqsAdapter>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
