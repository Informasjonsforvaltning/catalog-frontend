import {searchConceptsForCatalog} from '@catalog-frontend/data-access';
import {SearchConceptResponse} from '@catalog-frontend/types';
import {NextApiRequest, NextApiResponse} from 'next';
import {getServerSession} from 'next-auth';
import {authOptions} from '../auth/[...nextauth]';

export default async function personHandler(
  req: NextApiRequest,
  res: NextApiResponse<SearchConceptResponse | string>
) {
  const session = await getServerSession(req, res, authOptions);
  const {accessToken} = session.user;
  const {catalogId, query: jsonSearchBody} = JSON.parse(req.body);

  searchConceptsForCatalog(
    catalogId,
    accessToken,
    JSON.stringify(jsonSearchBody)
  ).then(async (response) => {
    if (response?.hits) {
      return res.status(200).send(response);
    } else res.status(404).send('Not found');
  });
}
