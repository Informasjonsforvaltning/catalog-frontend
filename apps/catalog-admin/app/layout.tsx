import {
  NextAuthProvider,
  ReactQueryClientProvider,
} from "@catalog-frontend/ui";
import { authOptions, localization } from "@catalog-frontend/utils";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import "./global.css";
import { AdminContextProvider } from "../context/admin";

export const metadata: Metadata = {
  title: localization.catalogType.admin,
  description: localization.catalogType.admin,
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider session={session}>
          <AdminContextProvider>
            <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
          </AdminContextProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
