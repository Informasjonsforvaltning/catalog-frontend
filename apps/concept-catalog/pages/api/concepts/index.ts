import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const resource = `${process.env.CONCEPT_CATALOG_BASE_URI}/begreper`;

  const token = await getToken({ req });
  const catalogId = req.body;

  const drafConcept = {
    anbefaltTerm: {
      navn: { nb: 'Nytt begrep' },
    },
    status: 'utkast',
    ansvarligVirksomhet: {
      id: catalogId,
    },
  };

  const options = {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(drafConcept),
    method: 'POST',
    cache: 'no-cache' as RequestCache,
  };

  try {
    const response = await fetch(resource, options);
    const conceptId = response?.headers?.get('location').split('/').pop();
    res.status(200).send({ conceptId });
  } catch (error) {
    res.status(404).send({ error: 'Failed to create concept' });
  }
}
