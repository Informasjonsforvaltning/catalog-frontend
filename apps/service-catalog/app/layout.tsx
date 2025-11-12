import { NextAuthProvider } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: localization.catalogType.service,
  description: localization.catalogType.service,
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
