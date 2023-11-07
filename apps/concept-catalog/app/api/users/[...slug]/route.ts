import { getUsers } from '@catalog-frontend/data-access';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function handler({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { slug } = params;
  const [catalogId] = slug;

  try {
    const response = await getUsers(catalogId, `${session?.accessToken}`);
    if (response.status !== 200) {
      return new Response('Failed to get user list', { status: response.status });
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response('Failed to get user list', { status: 500 });
  }
}
