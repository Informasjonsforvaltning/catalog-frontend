import { createCodeList, getAllCodeLists } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  const { slug } = req.query;

  if (req.method == 'GET') {
    getAllCodeLists(slug as string, `${token?.access_token}`)
      .then((response) => {
        return res.status(200).send(response);
      })
      .catch(() => {
        return res.status(500).send('');
      });
  } else if (req.method == 'POST') {
    const { codeList } = JSON.parse(req.body);

    createCodeList(codeList, `${token?.access_token}`, slug as string)
      .then((response) => {
        console.log('POST-response', response.status);
        return res.status(200).send(response);
      })
      .catch(() => {
        return res.status(500).send('');
      });
  }
  // else if (req.method == 'PUT') {
  //   const { comment } = JSON.parse(req.body);

  //   updateComment(orgNumber as string, topicId as string, commentId, comment, `${token?.access_token}`)
  //     .then((response) => {
  //       return res.status(200).send(response);
  //     })
  //     .catch(() => {
  //       return res.status(500).send('');
  //     });
  // } else if (req.method == 'DELETE') {
  //   deleteComment(orgNumber as string, topicId as string, commentId, `${token?.access_token}`)
  //     .then(() => {
  //       return res.status(200).send('');
  //     })
  //     .catch((e) => res.status(500).send(''));
  // }
  else {
    return res.status(400).send('');
  }
}
