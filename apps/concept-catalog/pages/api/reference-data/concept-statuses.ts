import { getConceptStatuses } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200);

  if (req.method == 'GET') {
    try {
      const response = await getConceptStatuses();
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to get concept statuses' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to get concept statuses' });
    }
  } else {
    return res.status(400).send('');
  }
}
