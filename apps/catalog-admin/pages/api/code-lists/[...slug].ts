import { createCodeList, deleteCodeList, getAllCodeLists, patchCodeList } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  const { slug } = req.query;
  const [catalogId, codeListId] = slug;

  if (req.method == 'GET') {
    getAllCodeLists(catalogId as string, `${token?.access_token}`)
      .then((response) => {
        return res.status(200).send(response);
      })
      .catch(() => {
        return res.status(500).send('');
      });
  } else if (req.method == 'POST') {
    const { codeList } = JSON.parse(req.body);

    createCodeList(codeList, `${token?.access_token}`, catalogId as string)
      .then((response) => {
        return res.status(200).send(response);
      })
      .catch(() => {
        return res.status(500).send('');
      });
  } else if (req.method == 'PATCH') {
    const { diff } = JSON.parse(req.body);
    patchCodeList(catalogId as string, codeListId as string, `${token?.access_token}`, diff)
      .then((response) => {
        return res.status(200).send(response);
      })
      .catch(() => {
        return res.status(500).send('');
      });
  } else if (req.method == 'DELETE') {
    deleteCodeList(catalogId as string, codeListId as string, `${token?.access_token}`)
      .then(() => {
        return res.status(200).send('');
      })
      .catch((e) => res.status(500).send(''));
  } else {
    return res.status(400).send('');
  }
}
