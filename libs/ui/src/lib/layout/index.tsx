import Footer from '../footer';
import Header from '../header';
import { ReactNode } from 'react';
import style from './layout.module.css';
import { RouteGuard } from '@catalog-frontend/utils';
import { GlobalStyle } from '@catalog-frontend/utils';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={style.layout}>
      <GlobalStyle />
      <RouteGuard>
        <Header />
        <main>{children}</main>
        <Footer />
      </RouteGuard>
    </div>
  );
};
