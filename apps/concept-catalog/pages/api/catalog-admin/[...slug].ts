import { getDesign, getDesignLogo } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token || (token?.expires_at && token?.expires_at < Date.now() / 1000)) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  res.status(200);

  const { slug } = req.query;

  if (req.method == 'GET' && slug?.length === 2 && slug[1] === 'design') {
    try {
      const response = await getDesign(slug[0], `${token?.access_token}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to get design' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to get design logo' });
    }
  } else if (req.method == 'GET' && slug?.length === 3 && slug[1] === 'design' && slug[2] === 'logo') {
    try {
      const response = await getDesignLogo(slug[0], `${token?.access_token}`);
      if (response.status !== 200) {
        return res.status(response.status).send('Failed to get design logo');
      }

      res.setHeader('Content-Type', response.headers.get('Content-Type'));
      res.setHeader('Content-Disposition', response.headers.get('Content-Disposition'));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      res.status(500).send('Failed to get design logo');
    }
  } else {
    res.status(400).send({ error: 'Invalid request' });
  }
}
