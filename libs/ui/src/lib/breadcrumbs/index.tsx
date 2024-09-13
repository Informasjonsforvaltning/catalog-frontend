import { hashCode, localization } from '@catalog-frontend/utils';
import styles from './breadcrumbs.module.css';
import Link from 'next/link';
export type BreadcrumbType = {
  href: string;
  text: string;
};

/* eslint-disable-next-line */
export interface BreadcrumbsProps {
  baseURI?: string;
  breadcrumbList?: BreadcrumbType[];
}

const Breadcrumbs = ({ baseURI, breadcrumbList }: BreadcrumbsProps) => {
  return (
    <div className='container'>
      <nav className={styles.breadcrumbs}>
        <span>
          <a
            className={styles.link}
            aria-label={localization.catalogOverview}
            href={baseURI ?? '/'}
          >
            {localization.catalogOverview}
          </a>
          {breadcrumbList?.map((breadcrumb, i) => {
            return (
              <span key={hashCode(breadcrumb.href)}>
                <span className={styles.separator}>{'>'}</span>
                {i === breadcrumbList.length - 1 ? (
                  <span className={styles.deactiveLink}>{breadcrumb.text}</span>
                ) : (
                  <Link
                    href={breadcrumb.href}
                    className={styles.link}
                  >
                    {breadcrumb.text}
                  </Link>
                )}
              </span>
            );
          })}
        </span>
      </nav>
    </div>
  );
};

export { Breadcrumbs };
