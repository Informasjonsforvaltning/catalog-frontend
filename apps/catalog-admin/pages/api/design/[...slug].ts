import { deleteLogo, getDesign, getDesignLogo, patchDesign, postDesignLogo } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token || (token?.expires_at && token?.expires_at < Date.now() / 1000)) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  res.status(200);

  const { slug } = req.query;
  const catalogId = slug[0];

  if (req.method == 'GET' && slug?.length === 2 && slug[1] === 'design') {
    try {
      const response = await getDesign(slug[0], `${token?.access_token}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to get design' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to get design' });
    }
  } else if (req.method == 'GET' && slug?.length === 2 && slug[1] === 'logo') {
    try {
      const response = await getDesignLogo(slug[0], `${token?.access_token}`);
      if (response.status !== 200) {
        return res.status(response.status).send('Failed to get design logo');
      }

      res.setHeader('Content-Type', response.headers.get('Content-Type'));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      res.status(500).send('Failed to get design logo');
    }
  } else if (req.method == 'PATCH') {
    try {
      const diff = JSON.parse(req.body);
      const response = await patchDesign(catalogId as string, `${token?.access_token}`, diff);

      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to update design' });
      }
      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to update design field' });
    }
  } else if (req.method == 'POST') {
    try {
      const logo = req.body;
      const response = await postDesignLogo(catalogId as string, `${token?.access_token}`, logo);

      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to update logo' });
      }
      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to update logo' });
    }
  } else if (req.method == 'DELETE' && slug[1] === 'logo') {
    try {
      const response = await deleteLogo(catalogId as string, `${token?.access_token}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to delete code list' });
      }

      return res.send(await response.json());
    } catch (error) {
      return res.status(500).send({ error: 'Failed to delete code list' });
    }
  } else {
    res.status(400).send({ error: 'Invalid request' });
  }
}
