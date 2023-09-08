import { createUser, deleteUser, getUsers, patchUser } from '@catalog-frontend/data-access';
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
  const [catalogId, userId] = slug;

  if (req.method == 'GET') {
    try {
      const response = await getUsers(catalogId, `${session?.accessToken}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to get user list' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to get user list' });
    }
  } else if (req.method == 'POST') {
    try {
      const { user } = JSON.parse(req.body);
      const response = await createUser(user, `${session?.accessToken}`, catalogId as string);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to create user' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to create user' });
    }
  } else if (req.method == 'PATCH') {
    try {
      const { diff } = JSON.parse(req.body);
      const response = await patchUser(catalogId as string, userId as string, `${session?.accessToken}`, diff);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to update user' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to update user' });
    }
  } else if (req.method == 'DELETE') {
    try {
      const response = await deleteUser(catalogId as string, userId as string, `${session?.accessToken}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to delete user' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete user' });
    }
  } else {
    return res.status(400).send('');
  }
}
