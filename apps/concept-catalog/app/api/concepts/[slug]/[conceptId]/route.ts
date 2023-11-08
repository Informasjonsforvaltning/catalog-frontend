import { deleteConcept } from '@catalog-frontend/data-access';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function DELETE(req: NextRequest, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }
  const { conceptId } = params;
  try {
    const response = await deleteConcept(conceptId, session?.accessToken);
    if (response.status !== 204) {
      throw new Error();
    }
    return new Response(response?.text?.toString(), { status: 200 });
  } catch (err) {
    return new Response('Failed to delete concept', { status: 500 });
  }
}
