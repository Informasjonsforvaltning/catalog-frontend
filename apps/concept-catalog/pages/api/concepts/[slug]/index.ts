import { createConcept, importConcepts } from '@catalog-frontend/data-access';
import { Status } from '@catalog-frontend/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req });
  if (!token || (token?.expires_at && token?.expires_at < Date.now() / 1000)) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const { slug } = req.query;

  if (req.method === 'POST' && slug === 'import') {
    try {
      const concepts = JSON.parse(req.body);
      const response = await importConcepts(concepts, token.access_token);
      res.status(response.status).send('');
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Failed to import concept' });
    }
  } else if (req.method === 'POST') {
    const drafConcept = {
      anbefaltTerm: {
        navn: { nb: 'Nytt begrep' },
      },
      status: 'utkast' as Status,
      ansvarligVirksomhet: {
        id: slug as string,
      },
    };

    try {
      const response = await createConcept(drafConcept, token.access_token);
      const conceptId = response?.headers?.get('location').split('/').pop();
      res.status(200).send({ conceptId });
    } catch (err) {
      res.status(500).send({ error: 'Failed to create concept' });
      console.log('error', err);
    }
    return;
  }

  res.status(400).send({ error: 'Invalid request' });
}
