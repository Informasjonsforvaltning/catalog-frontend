import { createConcept, importConcepts } from '@catalog-frontend/data-access';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const { slug } = req.query;

  if (req.method === 'POST' && slug === 'import') {
    try {
      const concepts = JSON.parse(req.body);
      const response = await importConcepts(concepts, session?.accessToken);
      res.status(response.status).send('');
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to import concept' });
    }
  } else if (req.method === 'POST') {
    const drafConcept = {
      anbefaltTerm: {
        navn: { nb: '' },
      },
      ansvarligVirksomhet: {
        id: slug as string,
      },
    };

    try {
      const response = await createConcept(drafConcept, session?.accessToken);
      if (response.status !== 201) {
        return res.status(response.status).send({ error: 'Failed to create concept' });
      }
      const conceptId = response?.headers?.get('location').split('/').pop();
      res.status(200).send({ conceptId });
    } catch (err) {
      res.status(500).send({ error: 'Failed to create concept' });
      console.error('error', err);
    }
    return;
  }

  res.status(400).send({ error: 'Invalid request' });
}
