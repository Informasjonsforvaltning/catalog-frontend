import { getUsers } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  const session = await getServerSession(authOptions);
  await validateSession(session);

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
