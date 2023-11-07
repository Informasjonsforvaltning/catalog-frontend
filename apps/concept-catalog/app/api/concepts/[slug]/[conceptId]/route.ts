import { deleteConcept } from '@catalog-frontend/data-access';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { conceptId } = params;

  try {
    const response = await deleteConcept(conceptId, session?.accessToken);
    if (response.status !== 200) {
      return new Response('Failed to delete concept', { status: response.status });
    }
    return new Response(response?.text?.toString(), { status: response?.status });
  } catch (err) {
    console.error('here');
    return new Response('Failed to delete concept', { status: 500 });
  }
}
