import {
  NextAuthProvider,
  ReactQueryClientProvider,
} from "@catalog-frontend/ui";
import { localization } from "@catalog-frontend/utils";
import { Metadata } from "next";
import "./global.css";
import { AdminContextProvider } from "../context/admin";

export const metadata: Metadata = {
  title: localization.catalogType.admin,
  description: localization.catalogType.admin,
};

const RootLayout = (props: LayoutProps<"/">) => {
  return (
    <html lang={localization.getLanguage()}>
      <body>
        <NextAuthProvider>
          <AdminContextProvider>
            <ReactQueryClientProvider>
              {props.children}
            </ReactQueryClientProvider>
          </AdminContextProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
