import { createCodeList, deleteCodeList, getAllCodeLists, patchCodeList } from '@catalog-frontend/data-access';
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
  const [catalogId, codeListId] = slug;

  if (req.method == 'GET') {
    try {
      const response = await getAllCodeLists(catalogId, `${session?.accessToken}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to get code lists' });
      }

      return res.send(await response.json());
    } catch (error) {
      return res.status(500).send({ error: 'Failed to get code lists' });
    }
  } else if (req.method == 'POST') {
    try {
      const { codeList } = JSON.parse(req.body);
      const response = await createCodeList(codeList, `${session?.accessToken}`, catalogId as string);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to create code list' });
      }

      return res.send(await response.json());
    } catch (error) {
      return res.status(500).send({ error: 'Failed to create code list' });
    }
  } else if (req.method == 'PATCH') {
    try {
      const { diff } = JSON.parse(req.body);
      const response = await patchCodeList(catalogId as string, codeListId as string, `${session?.accessToken}`, diff);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to update code list' });
      }

      return res.send(await response.json());
    } catch (error) {
      return res.status(500).send({ error: 'Failed to update code list' });
    }
  } else if (req.method == 'DELETE') {
    try {
      const response = await deleteCodeList(catalogId as string, codeListId as string, `${session?.accessToken}`);
      if (response.status !== 200) {
        return res.status(response.status).send({ error: 'Failed to delete code list' });
      }

      return res.send(await response.json());
    } catch (error) {
      return res.status(500).send({ error: 'Failed to delete code list' });
    }
  } else {
    return res.status(400).send('');
  }
}
