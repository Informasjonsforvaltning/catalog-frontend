import { deleteConcept } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token || (token?.expires_at && token?.expires_at < Date.now() / 1000)) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const { conceptId } = req.query;

  if (req.method === 'DELETE') {
    try {
      const response = await deleteConcept(conceptId as string, token.access_token);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to delete concept' });
      }
      res.status(response?.status).send(response?.text);
    } catch (err) {
      res.status(500).send({ error: 'Failed to delete concept' });
    }
  }
  res.status(400).send({ error: 'Invalid request' });
}
