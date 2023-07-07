interface Props {
  path: string;
  method: any;
  body?: any;
}

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

const paramsToSearchBody = ({ q, ...params }: any) => {
  const body = {
    q,
    filters: mapFilters(params),
  };
  return body;
};

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
  });

export const searchConceptsByIdentifiers = (identifiers: string[]) =>
  searchFullTextApi({
    path: '/concepts',
    method: 'POST',
    body: paramsToSearchBody({ identifier: identifiers }),
  });
