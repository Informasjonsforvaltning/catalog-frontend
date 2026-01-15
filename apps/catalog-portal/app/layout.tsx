import { NextAuthProvider } from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: localization.catalogOverview,
  description: localization.catalogOverview,
};

const RootLayout = (props: LayoutProps<"/">) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider>{props.children}</NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
