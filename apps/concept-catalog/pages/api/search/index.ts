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
    return res.status(401).send({ error: 'Unauthorized' });
  }

  res.status(200);

  try {
    const { catalogId, query: searchQuery } = JSON.parse(req.body);
    const response = await searchConceptsForCatalog(catalogId, searchQuery, `${token.access_token}`);
    if (response.status !== 200) {
      console.error('Failed to search concepts', await response.text());
      return res.status(response.status).send({ error: 'Failed to search concepts' });
    }

    res.send(await response.json());
  } catch (error) {
    console.error('Failed to search concepts', error);
    res.status(500).send({ error: 'Failed to search concepts' });
  }
}
