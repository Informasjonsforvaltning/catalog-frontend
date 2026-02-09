import { getCommentActivityLogData } from "@concept-catalog/utils/activity-log";
import { CommentActivityLog } from "./comment-activity-log";
import { ActivityLogPagination } from "./activity-log-pagination";

type Props = {
  catalogId: string;
  accessToken: string | undefined;
  currentPage: number;
};

export const CommentActivityLogContent = async ({
  catalogId,
  accessToken,
  currentPage,
}: Props) => {
  const { comments, pagination } = await getCommentActivityLogData(
    catalogId,
    accessToken,
    currentPage,
  );
  const totalPages = pagination?.totalPages ?? 0;

  return (
    <>
      <CommentActivityLog catalogId={catalogId} comments={comments} />
      {totalPages > 1 && (
        <ActivityLogPagination
          catalogId={catalogId}
          totalPages={totalPages}
          currentPage={currentPage}
          view="comments"
        />
      )}
    </>
  );
};
