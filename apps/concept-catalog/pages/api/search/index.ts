import { searchConceptsForCatalog } from '@catalog-frontend/data-access';
import { ErrorResponse, SearchConceptResponse } from '@catalog-frontend/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchConceptResponse | ErrorResponse>,
) {
  const token = await getToken({ req });
  if (!token || (token?.expires_at && token?.expires_at < Date.now() / 1000)) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const { catalogId, query } = JSON.parse(req.body);

  searchConceptsForCatalog(catalogId, query, `${token?.access_token}`).then(async (response) => {
    if (response?.hits) {
      return res.status(200).send(response);
    } else res.status(404).send({ error: 'Not found' });
  });
}
