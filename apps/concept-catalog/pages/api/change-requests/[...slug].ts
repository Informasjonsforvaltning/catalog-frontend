import { deleteChangeRequest, getChangeRequests } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });

  if (!token || (token?.expires_at && token?.expires_at < Date.now() / 1000)) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  res.status(200);

  const { slug } = req.query;
  const [catalogId, changeRequestId] = slug;

  if (req.method == 'GET') {
    try {
      const response = await getChangeRequests(catalogId, `${token?.access_token}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to get change requests' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to get change requests' });
    }
  } else if (req.method == 'DELETE') {
    try {
      const response = await deleteChangeRequest(
        catalogId as string,
        changeRequestId as string,
        `${token?.access_token}`,
      );
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to change request' });
      }
      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete change request' });
    }
  } else {
    return res.status(400).send('');
  }
}
