import { publishConcept } from '@catalog-frontend/data-access';
import { authOptions } from '../../../../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function POST({ params }: { params: { conceptId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { conceptId } = params;

  try {
    const response = await publishConcept(conceptId, session?.accessToken);
    if (response.status !== 200) {
      return new Response('Failed to publish concept', { status: response.status });
    }

    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response?.status });
  } catch (err) {
    return new Response('Failed to publish concept', { status: 500 });
  }
}
