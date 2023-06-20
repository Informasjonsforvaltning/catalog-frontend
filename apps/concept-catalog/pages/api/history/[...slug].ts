import { getHistory } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token || (token?.expires_at && token?.expires_at < Date.now() / 1000)) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const { slug } = req.query;

  if (req.method == 'GET' && slug?.length == 2) {
    const [catalogId, resourceId] = slug;

    getHistory(catalogId, resourceId, `${token?.access_token}`)
      .then((response) => {
        return res.status(200).send(response);
      })
      .catch(() => {
        return res.status(500).send({ error: 'Failed to get history' });
      });
  } else {
    return res.status(400).send({ error: 'Invalid request' });
  }
}
