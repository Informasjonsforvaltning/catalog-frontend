import Footer from '../footer';
import Header from '../header';
import { ReactNode } from 'react';
import style from './layout.module.css';
import { RouteGuard } from '@catalog-frontend/utils';
import { GlobalStyle } from '@catalog-frontend/utils';
import cn from 'classnames';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={cn(style.layout, className)}>
      <GlobalStyle />
      <RouteGuard>
        <Header />
        <main>{children}</main>
        <Footer />
      </RouteGuard>
    </div>
  );
};
