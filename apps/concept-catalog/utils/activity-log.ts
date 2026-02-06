import {
  getCatalogHistory,
  getConceptsForCatalog,
} from "@catalog-frontend/data-access";
import {
  Concept,
  HistoryPagination,
  Update,
  UpdateList,
} from "@catalog-frontend/types";

export type EnrichedUpdate = Update & {
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

export type ActivityLogData = {
  updates: EnrichedUpdate[];
  pagination?: HistoryPagination;
};

export async function getActivityLogData(
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
