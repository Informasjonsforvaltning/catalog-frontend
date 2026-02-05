import { getActivityLogData } from "@concept-catalog/utils/activity-log";
import { ConceptActivityLog } from "./concept-activity-log";
import { ActivityLogPagination } from "./activity-log-pagination";

type Props = {
  catalogId: string;
  accessToken: string | undefined;
  currentPage: number;
};

export const ConceptActivityLogContent = async ({
  catalogId,
  accessToken,
  currentPage,
}: Props) => {
  const { updates, pagination } = await getActivityLogData(
    catalogId,
    accessToken,
    currentPage,
  );
  const totalPages = pagination?.totalPages ?? 0;

  return (
    <>
      <ConceptActivityLog catalogId={catalogId} updates={updates} />
      {totalPages > 1 && (
        <ActivityLogPagination
          catalogId={catalogId}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      )}
    </>
  );
};
