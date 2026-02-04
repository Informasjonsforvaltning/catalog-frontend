import { redirect } from "next/navigation";
import { localization } from "@catalog-frontend/utils";
import { withReadProtectedPage } from "@concept-catalog/utils/auth";
import {
  Breadcrumbs,
  BreadcrumbType,
  DesignBanner,
} from "@catalog-frontend/ui";
import { ActivityLogPageClient } from "./activity-log-page-client";
import { ActivityLog } from "./activity-log";
import { getActivityLogData } from "@concept-catalog/utils/activity-log";
import { ActivityLogPagination } from "./activity-log-pagination";

const ActivityLogPage = withReadProtectedPage(
  ({ catalogId }) => `/catalogs/${catalogId}/activity-log`,
  async ({ catalogId, session, searchParams }) => {
    if (process.env.NEXT_PUBLIC_ACTIVITY_LOG_ENABLED !== "true") {
      redirect(`/catalogs/${catalogId}/concepts`);
    }

    const currentPage = Number(searchParams.page) || 1;

    const breadcrumbList = catalogId
      ? ([
          {
            href: `/catalogs/${catalogId}`,
            text: localization.catalogType.concept,
          },
          {
            href: `/catalogs/${catalogId}/activity-log`,
            text: localization.activityLog,
          },
        ] as BreadcrumbType[])
      : [];

    const { updates, pagination } = await getActivityLogData(
      catalogId,
      session.accessToken,
      currentPage,
    );
    const totalPages = pagination?.totalPages ?? 0;

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
          <ActivityLog catalogId={catalogId} updates={updates} />
          {totalPages > 1 && (
            <ActivityLogPagination
              catalogId={catalogId}
              totalPages={totalPages}
              currentPage={currentPage}
            />
          )}
        </ActivityLogPageClient>
      </>
    );
  },
);

export default ActivityLogPage;
