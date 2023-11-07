import { createConcept, importConcepts } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  if (slug === 'import') {
    try {
      const concepts = await req.json();
      const response = await importConcepts(concepts, session?.accessToken);

      if (response.status > 399) {
        const error = await response.json();
        return new Response(error?.message ?? 'Failed to import concept', { status: response.status });
      } else {
        return new Response('', { status: response.status });
      }
    } catch (error) {
      console.error(error);
      return new Response('Failed to import concept', { status: 500 });
    }
  } else {
    const drafConcept = {
      anbefaltTerm: {
        navn: { nb: '' },
      },
      ansvarligVirksomhet: {
        id: slug,
      },
    };

    try {
      const response = await createConcept(drafConcept, session?.accessToken);
      if (response.status !== 201) {
        throw new Error();
      }
      const conceptId = response?.headers?.get('location')?.split('/').pop();
      return new Response(JSON.stringify(conceptId), { status: 200 });
    } catch (err) {
      return new Response('Failed to create concept', { status: 500 });
    }
  }
};
