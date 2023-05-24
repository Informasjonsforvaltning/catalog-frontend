import { createComment, deleteComment, getComments, updateComment } from '@catalog-frontend/data-access';
import { SearchConceptResponse } from '@catalog-frontend/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse<SearchConceptResponse | string>) {
  const token = await getToken({ req });
  const { orgNumber, topicId } = req.query;

  if(req.method == 'GET') {
    getComments(orgNumber as string, topicId as string, `${token?.access_token}`).then(
      response => {
        return res.status(200).send(response);
      },
    ).catch(() => { 
      return res.status(500).send('');   
    });
  } else if(req.method == 'POST') {

    const { comment } = JSON.parse(req.body);

    createComment(orgNumber as string, topicId as string, comment, `${token?.access_token}`).then(
      response => {
        return res.status(200).send(response);
      },
    ).catch(() => { 
      return res.status(500).send('');   
    });
  } else if(req.method == 'PUT') {

    const { commentId, comment } = JSON.parse(req.body);

    updateComment(orgNumber as string, topicId as string, commentId, comment, `${token?.access_token}`).then(
      response => {
        return res.status(200).send(response);
      },
    ).catch(() => { 
      return res.status(500).send('');   
    });
  } else if(req.method == 'DELETE') {

    const { commentId } = JSON.parse(req.body);

    deleteComment(orgNumber as string, topicId as string, commentId, `${token?.access_token}`)
      .then(() => {
        return res.status(200).send('');
      }
    ).catch(e => res.status(500).send(''));   
    
  } else {
    return res.status(400).send('');
  }     
}
