import StyledBreadcrumbs, { InternalLink, ExternalLink, Separator, DeactiveLink } from './styled';
import { localization } from '@catalog-frontend/utils';

export type BreadcrumbType = {
  href: string;
  text: string;
};

/* eslint-disable-next-line */
export interface BreadcrumbsProps {
  breadcrumbList?: BreadcrumbType[];
}

export function Breadcrumbs({ breadcrumbList }: BreadcrumbsProps) {
  return (
    <div className='container'>
      <StyledBreadcrumbs>
        <span>
          <ExternalLink
            aria-label={localization.allCatalogs}
            href={process.env.REGISTRATION_HOST}
          >
            {localization.allCatalogs}
          </ExternalLink>
          {breadcrumbList &&
            breadcrumbList.map((breadcrumb, i) => {
              return (
                <span key={i}>
                  <Separator>{'>'}</Separator>
                  {i === breadcrumbList.length - 1 ? (
                    <DeactiveLink>{breadcrumb.text}</DeactiveLink>
                  ) : (
                    <InternalLink href={breadcrumb.href}>{breadcrumb.text}</InternalLink>
                  )}
                </span>
              );
            })}
        </span>
      </StyledBreadcrumbs>
    </div>
  );
}

export default Breadcrumbs;
