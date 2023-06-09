import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/begreper/import`;

  const token = await getToken({ req });

  const options = {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
    },
    body: req.body,
    method: 'POST',
    cache: 'no-cache' as RequestCache,
  };

  try {
    const response = await fetch(resource, options);
    res.status(response.status).send('');
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Failed to import concept' });
  }
}
