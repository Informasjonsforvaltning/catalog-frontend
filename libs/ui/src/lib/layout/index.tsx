import { ReactNode } from 'react';
import Footer from '../footer';
import Header from '../header';
import { RouteGuard } from '@catalog-frontend/utils';
import cn from 'classnames';

import './reset.css';

import '@digdir/design-system-tokens/brand/digdir/tokens.css';
import '@altinn/figma-design-tokens/dist/tokens.css';
import './global.css';
import './break-points.css';
import style from './layout.module.css';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={cn(style.layout, className)}>
      <RouteGuard>
        <Header />
        <main>{children}</main>
        <Footer />
      </RouteGuard>
    </div>
  );
};
