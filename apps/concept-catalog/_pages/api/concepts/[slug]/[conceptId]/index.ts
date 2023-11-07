import { deleteConcept } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../../../auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const { conceptId } = req.query;

  if (req.method === 'DELETE') {
    try {
      const response = await deleteConcept(conceptId as string, session?.accessToken);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to delete concept' });
      }
      return res.status(response?.status).send(await response?.text());
    } catch (err) {
      return res.status(500).send({ error: 'Failed to delete concept' });
    }
  }
  res.status(400).send({ error: 'Invalid request' });
}
