import { searchConceptsForCatalog } from '@catalog-frontend/data-access';
import { SearchConceptResponse } from '@catalog-frontend/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse<SearchConceptResponse | string>) {
  const token = await getToken({ req });
  const { catalogId, query: searchQuery } = JSON.parse(req.body);

  await searchConceptsForCatalog(catalogId, searchQuery, `${token.access_token}`).then(async (response) => {
    if (response?.hits) {
      return res.status(200).send(response);
    } else res.status(404).send('Not found');
  });
}
