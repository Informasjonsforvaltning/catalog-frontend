import {
  getCatalogHistory,
  getComments,
  getConceptsForCatalog,
} from "@catalog-frontend/data-access";
import {
  Comment,
  Concept,
  HistoryPagination,
  Update,
  UpdateList,
} from "@catalog-frontend/types";

export type EnrichedUpdate = Update & {
  concept?: Concept;
};

export type EnrichedComment = Comment & {
  concept?: Concept;
};

export const PAGE_SIZE = 20;

export const mapHistoryWithConcepts = (
  updates: Update[],
  concepts: Concept[],
): EnrichedUpdate[] => {
  const conceptMap = new Map(concepts.map((c) => [c.id, c]));

  return updates.map((update) => ({
    ...update,
    concept: conceptMap.get(update.resourceId),
  }));
};

export const mapCommentsWithConcepts = (
  comments: Comment[],
  concepts: Concept[],
): EnrichedComment[] => {
  const conceptMap = new Map(concepts.map((c) => [c.id, c]));

  return comments.map((comment) => ({
    ...comment,
    concept: conceptMap.get(comment.topicId),
  }));
};

export type ActivityLogData = {
  updates: EnrichedUpdate[];
  pagination?: HistoryPagination;
};

export type CommentActivityLogData = {
  comments: EnrichedComment[];
};

export async function getConceptActivityLogData(
  catalogId: string,
  accessToken: string | undefined,
  page: number = 1,
): Promise<ActivityLogData> {
  if (!accessToken) {
    return { updates: [] };
  }

  const [historyResponse, conceptsResponse] = await Promise.all([
    getCatalogHistory(catalogId, accessToken, page, PAGE_SIZE),
    getConceptsForCatalog(catalogId, accessToken),
  ]);

  const historyData: UpdateList = await historyResponse.json();
  const conceptsData: Concept[] = await conceptsResponse.json();

  const updates = mapHistoryWithConcepts(
    historyData.updates ?? [],
    conceptsData,
  );

  return {
    updates,
    pagination: historyData.pagination,
  };
}

export async function getCommentActivityLogData(
  catalogId: string,
  accessToken: string | undefined,
): Promise<CommentActivityLogData> {
  if (!accessToken) {
    return { comments: [] };
  }

  const [commentsResponse, conceptsResponse] = await Promise.all([
    getComments(catalogId, accessToken),
    getConceptsForCatalog(catalogId, accessToken),
  ]);

  const commentsData: Comment[] = commentsResponse.ok
    ? await commentsResponse.json()
    : [];
  const conceptsData: Concept[] = await conceptsResponse.json();

  const comments = mapCommentsWithConcepts(commentsData, conceptsData);

  return { comments };
}
