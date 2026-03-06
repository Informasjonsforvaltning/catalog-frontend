import { NextAuthProvider } from "@catalog-frontend/ui-v2";
import { authOptions, localization } from "@catalog-frontend/utils";
import { Metadata } from "next";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: localization.catalogOverview,
  description: localization.catalogOverview,
};

const RootLayout = async (props: LayoutProps<"/">) => {
  const session = await getServerSession(authOptions);

  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider session={session}>{props.children}</NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
