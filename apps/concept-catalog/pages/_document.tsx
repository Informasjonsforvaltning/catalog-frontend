/* eslint-disable react/display-name */
import { localization } from '@catalog-frontend/utils';
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang={localization.getLanguage()}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
