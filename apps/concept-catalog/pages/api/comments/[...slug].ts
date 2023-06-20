import { createComment, deleteComment, getComments, updateComment } from '@catalog-frontend/data-access';
import { ErrorResponse } from '@catalog-frontend/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Comment[] | string | ErrorResponse>) {
  const token = await getToken({ req });
  if (!token || (token?.expires_at && token?.expires_at < Date.now() / 1000)) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const { slug } = req.query;

  if (slug?.length >= 2 && slug?.length <= 3) {
    const [orgNumber, topicId, commentId] = slug;

    if (req.method == 'GET') {
      getComments(orgNumber as string, topicId as string, `${token?.access_token}`)
        .then((response) => {
          return res.status(200).send(response);
        })
        .catch(() => {
          return res.status(500).send({ error: 'Failed to get comments' });
        });
    } else if (req.method == 'POST') {
      const { comment } = JSON.parse(req.body);

      createComment(orgNumber as string, topicId as string, comment, `${token?.access_token}`)
        .then((response) => {
          return res.status(200).send(response);
        })
        .catch(() => {
          return res.status(500).send({ error: 'Failed to create comment' });
        });
    } else if (req.method == 'PUT') {
      const { comment } = JSON.parse(req.body);

      updateComment(orgNumber as string, topicId as string, commentId, comment, `${token?.access_token}`)
        .then((response) => {
          return res.status(200).send(response);
        })
        .catch(() => {
          return res.status(500).send({ error: 'Failed to update comment' });
        });
    } else if (req.method == 'DELETE') {
      deleteComment(orgNumber as string, topicId as string, commentId, `${token?.access_token}`)
        .then(() => {
          return res.status(200).send('');
        })
        .catch((e) => res.status(500).send({ error: 'Failed to delete comment' }));
    } else {
      return res.status(400).send({ error: 'Invalid request' });
    }
  } else {
    return res.status(400).send({ error: 'Invalid request' });
  }
}
