import { createInternalField, deleteInternalField, getFields, patchInternalField } from '@catalog-frontend/data-access';
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
  const [catalogId, fieldId] = slug;

  if (req.method == 'GET') {
    try {
      const response = await getFields(catalogId, `${session?.accessToken}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to get internal fields' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to get internal fields' });
    }
  } else if (req.method == 'POST') {
    try {
      const { field } = JSON.parse(req.body);
      const response = await createInternalField(field, `${session?.accessToken}`, catalogId as string);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to create internal field' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to create internal field' });
    }
  } else if (req.method == 'PATCH') {
    try {
      const { diff } = JSON.parse(req.body);
      const response = await patchInternalField(
        catalogId as string,
        fieldId as string,
        `${session?.accessToken}`,
        diff,
      );

      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to update internal field' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to update internal field' });
    }
  } else if (req.method == 'DELETE') {
    try {
      const response = await deleteInternalField(catalogId as string, fieldId as string, `${session?.accessToken}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to delete internal field' });
      }

      res.send(await response.json());
    } catch (error) {
      res.status(500).send({ error: 'Failed to delete internal field' });
    }
  } else {
    return res.status(400).send('');
  }
}
