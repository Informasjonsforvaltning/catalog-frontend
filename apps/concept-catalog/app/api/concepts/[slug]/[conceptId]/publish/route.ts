import { publishConcept } from '@catalog-frontend/data-access';
import { authOptions } from '@catalog-frontend/utils';
import { Session, getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { conceptId: string } }) {
  const session: Session | null = await getServerSession(authOptions);
  if (session?.accessTokenExpiresAt && session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { conceptId } = params;
  try {
    const response = await publishConcept(conceptId, session?.accessToken as string);
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response?.status });
  } catch (err) {
    return new Response('Failed to publish concept', { status: 500 });
  }
}
