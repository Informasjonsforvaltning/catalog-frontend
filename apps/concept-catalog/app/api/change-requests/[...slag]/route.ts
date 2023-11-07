import { createChangeRequest, getChangeRequests, updateChangeRequest } from '@catalog-frontend/data-access';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

async function handler(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { slug } = params;
  const [catalogId, postType, changeRequestId] = slug;

  if (req.method == 'GET') {
    try {
      const response = await getChangeRequests(`${catalogId}`, `${session?.accessToken}`);
      if (response.status !== 200) {
        return new Response('Failed to get change requests', { status: response.status });
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get change requests', { status: 500 });
    }
  } else if (req.method == 'POST' && postType == 'createChangeRequest') {
    try {
      const response = await createChangeRequest(req.body, `${catalogId}`, `${session?.accessToken}`);
      if (response.status !== 201) {
        return new Response('Failed to create change request', { status: response.status });
      }
      const changeRequestId = response?.headers?.get('location')?.split('/').pop();
      return new Response(JSON.stringify(changeRequestId), { status: response.status });
    } catch (error) {
      return new Response('Failed to create change request', { status: 500 });
    }
  } else if (req.method == 'POST' && postType == 'updateChangeRequest') {
    try {
      const response = await updateChangeRequest(
        req.body,
        `${catalogId}`,
        `${changeRequestId}`,
        `${session?.accessToken}`,
      );
      if (response.status !== 200) {
        return new Response('Failed to update change request', { status: response.status });
      }
    } catch (error) {
      return new Response('Failed to update change request', { status: 500 });
    }
  } else {
    return new Response('', { status: 400 });
  }
}

export { handler as GET, handler as POST };
