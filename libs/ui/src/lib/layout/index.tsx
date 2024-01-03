import { ReactNode } from 'react';
import { Footer } from '../footer';
import { Header } from '../header';
import { RouteGuard } from '@catalog-frontend/utils';
import cn from 'classnames';

import './reset.css';
import '@digdir/design-system-tokens/brand/digdir/tokens.css';
import '@altinn/figma-design-tokens/dist/tokens.css';
import './global.css';

import style from './layout.module.css';
import ErrorBoundary from '../error-boundry';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  fontColor?: string;
  backgroundColor?: string;
  catalogAdminUrl?: string;
  fdkRegistrationBaseUrl?: string;
  adminGuiBaseUrl?: string;
  fdkCommunityBaseUrl?: string;
  fdkBaseUrl?: string;
}

export const Layout = ({
  children,
  className,
  fontColor,
  backgroundColor,
  catalogAdminUrl,
  fdkRegistrationBaseUrl,
  adminGuiBaseUrl,
  fdkCommunityBaseUrl,
  fdkBaseUrl,
}: LayoutProps) => {
  return (
    <div className={cn(style.layout, className)}>
      <RouteGuard>
        <Header
          fontColor={fontColor}
          backgroundColor={backgroundColor}
          catalogAdminUrl={catalogAdminUrl}
          fdkRegistrationBaseUrl={fdkRegistrationBaseUrl}
          adminGuiBaseUrl={adminGuiBaseUrl}
          fdkCommunityBaseUrl={fdkCommunityBaseUrl}
          fdkBaseUrl={fdkBaseUrl}
        />
        <main className={style.main}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer
          fontColor={fontColor}
          backgroundColor={backgroundColor}
        />
      </RouteGuard>
    </div>
  );
};
