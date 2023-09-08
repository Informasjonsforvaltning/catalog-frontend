import { getHistory } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const { slug } = req.query;

  if (req.method == 'GET' && slug?.length == 2) {
    const [catalogId, resourceId] = slug;

    try {
      const response = await getHistory(catalogId, resourceId, `${session?.accessToken}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to get history' });
      }
      return res.status(200).send(await response.json());
    } catch (error) {
      console.error('Failed to get history', error);
      return res.status(500).send({ error: 'Failed to get history' });
    }
  } else {
    return res.status(400).send({ error: 'Invalid request' });
  }
}
