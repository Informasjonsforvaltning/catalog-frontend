import { deleteConcept } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  const { conceptId } = req.query;

  if (req.method === 'DELETE') {
    try {
      const response = await deleteConcept(conceptId as string, token.access_token);
      res.status(response?.status).send(response?.text);
    } catch (err) {
      res.status(500).send({ error: 'Failed to delete concept' });
    }
  }
  res.status(400).send({ error: 'Invalid request' });
}
