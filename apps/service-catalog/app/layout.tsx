import {
  AuthSessionModal,
  NextAuthProvider,
  ReactQueryClientProvider,
} from "@catalog-frontend/ui";
import { authOptions, localization } from "@catalog-frontend/utils";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: localization.catalogType.service,
  description: localization.catalogType.service,
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider session={session}>
          <AuthSessionModal storageKey="serviceForm" />
          <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
