import { getDesign, getDesignLogo } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  res.status(200);

  const { slug } = req.query;

  if (req.method == 'GET' && slug?.length === 2 && slug[1] === 'design') {
    try {
      const response = await getDesign(slug[0], `${session?.accessToken}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to get design' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to get design logo' });
    }
  } else if (req.method == 'GET' && slug?.length === 3 && slug[1] === 'design' && slug[2] === 'logo') {
    try {
      const response = await getDesignLogo(slug[0], `${session?.accessToken}`);
      if (response.status !== 200) {
        return res.status(response.status).send('Failed to get design logo');
      }

      res.setHeader('Content-Type', response.headers.get('Content-Type'));
      res.setHeader('Content-Disposition', response.headers.get('Content-Disposition'));
      res.setHeader('Cache-Control', response.headers.get('Cache-Control'));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      res.status(500).send('Failed to get design logo');
    }
  } else {
    res.status(400).send({ error: 'Invalid request' });
  }
}
