import { redirect } from "next/navigation";
import { localization } from "@catalog-frontend/utils";
import { withReadProtectedPage } from "@concept-catalog/utils/auth";
import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import { ActivityLogPageClient } from "./activity-log-page-client";
import { ConceptActivityLogContent } from "./concept-activity-log-content";
import { CommentActivityLogContent } from "./comment-activity-log-content";

const ActivityLogPage = withReadProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/activity-log`,
  async ({ catalogId, searchParams }) => {
    if (process.env.NEXT_PUBLIC_ACTIVITY_LOG_ENABLED !== "true") {
      redirect(`/catalogs/${catalogId}/concepts`);
    }

    const currentPage = Number(searchParams.page) || 0;
    const view = searchParams.view || "concepts";

    const breadcrumbList = catalogId
      ? ([
          {
            href: `/catalogs/${catalogId}`,
            text: localization.catalogType.concept,
          },
          {
            href: `/catalogs/${catalogId}/activity-log`,
            text: localization.activityLog.title,
          },
        ] as BreadcrumbType[])
      : [];

    return (
      <>
        <Breadcrumbs
          breadcrumbList={breadcrumbList}
          catalogPortalUrl={`${process.env.CATALOG_PORTAL_BASE_URI}/catalogs`}
        />
        <DesignBanner
          title={localization.catalogType.concept}
          catalogId={catalogId}
        />
        <ActivityLogPageClient catalogId={catalogId}>
          {view === "concepts" ? (
            <ConceptActivityLogContent
              catalogId={catalogId}
              currentPage={currentPage}
            />
          ) : (
            <CommentActivityLogContent
              catalogId={catalogId}
              currentPage={currentPage}
            />
          )}
        </ActivityLogPageClient>
      </>
    );
  },
);

export default ActivityLogPage;
