import { getDesign, patchDesign } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token || (token?.expires_at && token?.expires_at < Date.now() / 1000)) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  res.status(200);

  const { catalogId } = req.query;

  if (req.method == 'GET') {
    try {
      const response = await getDesign(`${catalogId}`, `${token?.access_token}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to get design' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to get design' });
    }
  } else if (req.method == 'PATCH') {
    try {
      const diff = JSON.parse(req.body);
      const response = await patchDesign(`${catalogId}`, `${token?.access_token}`, diff);

      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to update design' });
      }
      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to update design field' });
    }
  } else {
    res.status(400).send({ error: 'Invalid request' });
  }
}
