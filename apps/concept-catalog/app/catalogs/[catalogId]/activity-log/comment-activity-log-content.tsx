import { getComments } from "@catalog-frontend/data-access";
import { Comment } from "@catalog-frontend/types";
import { CommentActivityLog } from "./comment-activity-log";

type Props = {
  catalogId: string;
  accessToken: string | undefined;
};

export const CommentActivityLogContent = async ({
  catalogId,
  accessToken,
}: Props) => {
  const response = await getComments(catalogId, accessToken);
  const comments: Comment[] = response.ok ? await response.json() : [];
  console.info("🚀 ~ CommentActivityLogContent ~ comments:", comments);

  return <CommentActivityLog catalogId={catalogId} comments={comments} />;
};
