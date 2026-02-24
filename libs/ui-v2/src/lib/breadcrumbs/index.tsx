import { localization } from "@catalog-frontend/utils";
import {
  Breadcrumbs as DSBreadcrumbs,
  BreadcrumbsList,
  BreadcrumbsItem,
  BreadcrumbsLink,
} from "@digdir/designsystemet-react";
import classNames from "classnames";
import styles from "./breadcrumbs.module.css";

export type BreadcrumbType = {
  href: string;
  text: string;
};

interface Props {
  breadcrumbList?: BreadcrumbType[];
  catalogPortalUrl: string;
}

export const Breadcrumbs = (props: Props) => {
  const { breadcrumbList, catalogPortalUrl } = props;
  return (
    <DSBreadcrumbs
      className={classNames("container", styles.breadcrumbs)}
      data-size="sm"
    >
      <BreadcrumbsLink
        aria-label={localization.button.backToOverview}
        className={styles.breadcrumbLink}
        href={catalogPortalUrl}
      >
        {localization.catalogOverview}
      </BreadcrumbsLink>
      <BreadcrumbsList>
        <BreadcrumbsItem>
          <BreadcrumbsLink
            className={styles.breadcrumbLink}
            href={catalogPortalUrl}
          >
            {localization.catalogOverview}
          </BreadcrumbsLink>
        </BreadcrumbsItem>
        {breadcrumbList?.map((breadcrumb) => (
          <BreadcrumbsItem key={breadcrumb.href}>
            <BreadcrumbsLink
              href={breadcrumb.href}
              className={styles.breadcrumbLink}
            >
              {breadcrumb.text}
            </BreadcrumbsLink>
          </BreadcrumbsItem>
        ))}
      </BreadcrumbsList>
    </DSBreadcrumbs>
  );
};
