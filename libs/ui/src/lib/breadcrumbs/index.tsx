import {
  Breadcrumbs as DsBreadcrumbs,
  BreadcrumbsItem,
  BreadcrumbsLink,
  BreadcrumbsList,
} from '@digdir/designsystemet-react';
import { hashCode, localization } from '@catalog-frontend/utils';
import Link from 'next/link';
import cn from 'classnames';
import styles from './breadcrumbs.module.css';

export type BreadcrumbType = {
  href: string;
  text: string;
};

/* eslint-disable-next-line */
export interface BreadcrumbsProps {
  breadcrumbList?: BreadcrumbType[];
  catalogPortalUrl: string;
}

const Breadcrumbs = ({ breadcrumbList, catalogPortalUrl }: BreadcrumbsProps) => {
  return (
    <div className={cn('container', styles.breadcrumb)}>
      <DsBreadcrumbs aria-label={localization.catalogOverview}>
        <BreadcrumbsLink
          href={catalogPortalUrl}
          aria-label={localization.catalogOverview}
        >
          {localization.catalogOverview}
        </BreadcrumbsLink>
        {breadcrumbList && breadcrumbList.length > 0 && (
          <BreadcrumbsList>
            {breadcrumbList.map((breadcrumb) => (
              <BreadcrumbsItem key={hashCode(breadcrumb.href)}>
                <BreadcrumbsLink href={breadcrumb.href}>
                  {breadcrumb.text}
                </BreadcrumbsLink>
              </BreadcrumbsItem>
            ))}
          </BreadcrumbsList>
        )}
      </DsBreadcrumbs>
    </div>
  );
};

export { Breadcrumbs };
