import { getCommentActivityLogData } from "@concept-catalog/utils/activity-log";
import { CommentActivityLog } from "./comment-activity-log";

type Props = {
  catalogId: string;
  accessToken: string | undefined;
};

export const CommentActivityLogContent = async ({
  catalogId,
  accessToken,
}: Props) => {
  const { comments } = await getCommentActivityLogData(catalogId, accessToken);
  /* TODO Add pagination https://github.com/Informasjonsforvaltning/catalog-frontend/issues/1660 */

  return <CommentActivityLog catalogId={catalogId} comments={comments} />;
};
