import {searchConceptsForCatalog} from '@catalog-frontend/data-access';
import {SearchConceptResponse} from '@catalog-frontend/types';
import {NextApiRequest, NextApiResponse} from 'next';
import { getToken } from "next-auth/jwt";

export default async function personHandler(
  req: NextApiRequest,
  res: NextApiResponse<SearchConceptResponse | string>
) {
  const token = await getToken({ req });
  const {catalogId, query: jsonSearchBody} = JSON.parse(req.body);

  searchConceptsForCatalog(
    catalogId,
    `${token.access_token}`,
    JSON.stringify(jsonSearchBody)
  ).then(async (response) => {
    if (response?.hits) {
      return res.status(200).send(response);
    } else res.status(404).send('Not found');
  });
}
