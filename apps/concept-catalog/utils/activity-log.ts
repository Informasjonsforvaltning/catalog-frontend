import { Concept, Update } from "@catalog-frontend/types";

export type EnrichedUpdate = Update & {
  concept?: Concept;
};

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
