import { publishConcept } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { Session, getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export const POST = async (request: NextRequest, { params }: { params: { conceptId: string } }) => {
  const session: Session | null = await getServerSession(authOptions);
  await validateSession(session);
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
};
