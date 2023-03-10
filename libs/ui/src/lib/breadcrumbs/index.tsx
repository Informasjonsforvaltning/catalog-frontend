import StyledBreadcrumbs, {
  InternalLink,
  ExternalLink,
  Separator,
  DeactiveLink,
  Divider,
} from './styled';
import {localization} from '@catalog-frontend/utils';

export type breadcrumbT = {
  href: string;
  text: string;
};

/* eslint-disable-next-line */
export interface BreadcrumbsProps {
  breadcrumbList?: breadcrumbT[];
}

export function Breadcrumbs({breadcrumbList}: BreadcrumbsProps) {
  return (
    <>
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
                <span>
                  <Separator>{'>'}</Separator>
                  {i === breadcrumbList.length - 1 ? (
                    <DeactiveLink>{breadcrumb.text}</DeactiveLink>
                  ) : (
                    <InternalLink href={breadcrumb.href}>
                      {breadcrumb.text}
                    </InternalLink>
                  )}
                </span>
              );
            })}
        </span>
      </StyledBreadcrumbs>
      <Divider />
    </>
  );
}

export default Breadcrumbs;
