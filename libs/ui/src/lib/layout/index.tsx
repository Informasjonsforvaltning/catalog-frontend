'use client';

import { ReactNode } from 'react';
import { Footer } from '../footer';
import { Header } from '../header';
import cn from 'classnames';

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
  fdkBaseUrl?: string;
  termsOfUseUrl?: string;
  catalogTitle?: string;
  displayFooter?: boolean;
}

export const Layout = ({
  children,
  className,
  fontColor,
  backgroundColor,
  catalogAdminUrl,
  fdkRegistrationBaseUrl,
  adminGuiBaseUrl,
  fdkBaseUrl,
  termsOfUseUrl,
  catalogTitle,
  displayFooter = true,
}: LayoutProps) => {
  return (
    <div className={cn(style.layout, className)}>
      <Header
        fontColor={fontColor}
        backgroundColor={backgroundColor}
        catalogAdminUrl={catalogAdminUrl}
        fdkRegistrationBaseUrl={fdkRegistrationBaseUrl}
        adminGuiBaseUrl={adminGuiBaseUrl}
        fdkBaseUrl={fdkBaseUrl}
        termsOfUseUrl={termsOfUseUrl}
      />
      <main className={style.main}>
        {/* <ErrorBoundary
          fdkRegistrationBaseUrl={fdkRegistrationBaseUrl}
          title={catalogTitle}
        > */}
          {children}
        {/* </ErrorBoundary> */}
      </main>
      {displayFooter && (
        <Footer
          fontColor={fontColor}
          backgroundColor={backgroundColor}
        />
      )}
    </div>
  );
};
