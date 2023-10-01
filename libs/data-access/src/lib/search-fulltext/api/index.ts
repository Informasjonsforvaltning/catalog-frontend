interface Props {
  path: string;
  method: any;
  body?: any;
}

const mapSorting = ({ sortfield }: any) =>
  sortfield === 'harvest.firstHarvested' ? { field: 'harvest.firstHarvested', direction: 'desc' } : undefined;

const mapFilters = ({ identifier }: any) => {
  const filters: any = [];
  if (identifier) {
    filters.push({
      collection: {
        field: 'identifier.keyword',
        values: identifier,
      },
    });
  }

  return filters.length > 0 ? filters : undefined;
};

export const paramsToSearchBody = ({ q, page, size, ...params }: any) => ({
  q,
  page: page ? Number(page) : undefined,
  size,
  sorting: mapSorting(params),
  filters: mapFilters(params),
});

const searchFullTextApi = ({ path, method, body }: Props) =>
  fetch(`${process.env.FULLTEXT_SEARCH_BASE_URI}${path}`, {
    ...{
      headers: {
        'Content-Type': 'application/json',
      },
      method,
      body,
    },
    ...(body && { body: JSON.stringify(body) }),
  }).catch((e) => console.error(`Error fetching ${path.slice(1)} from fulltext-search-api:\n`, e));

export const searchConceptsByIdentifiers = (identifiers: string[]) =>
  searchFullTextApi({
    path: '/concepts',
    method: 'POST',
    body: paramsToSearchBody({ identifier: identifiers }),
  });
