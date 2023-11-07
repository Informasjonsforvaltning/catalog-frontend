import { createComment, deleteComment, getComments, updateComment } from '@catalog-frontend/data-access';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextRequest } from 'next/server';

async function handler(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { slug } = params;

  if (slug?.length >= 2 && slug?.length <= 3) {
    const [orgNumber, topicId, commentId] = slug;

    if (req.method == 'GET') {
      try {
        const response = await getComments(orgNumber, topicId, `${session?.accessToken}`);
        if (response.status !== 200) {
          return new Response('Failed to get comments', { status: response.status });
        }
        const jsonResponse = await response.json();
        return new Response(JSON.stringify(jsonResponse), { status: response.status });
      } catch (error) {
        return new Response('Failed to get comments', { status: 500 });
      }
    } else if (req.method == 'POST') {
      const { comment } = JSON.parse(req.body);

      try {
        const response = await createComment(orgNumber, topicId, comment, `${session?.accessToken}`);
        if (response.status !== 200) {
          return new Response('Failed to create comment', { status: response.status });
        }
        const jsonResponse = await response.json();
        return new Response(JSON.stringify(jsonResponse), { status: response.status });
      } catch (error) {
        return new Response('Failed to create comment', { status: 500 });
      }
    } else if (req.method == 'PUT') {
      const { comment } = JSON.parse(req.body);

      try {
        const response = await updateComment(orgNumber, topicId, commentId, comment, `${session?.accessToken}`);
        if (response.status !== 200) {
          return new Response('Failed to update comment', { status: response.status });
        }
        const jsonResponse = await response.json();
        return new Response(JSON.stringify(jsonResponse), { status: response.status });
      } catch (error) {
        return new Response('Failed to update comment', { status: 500 });
      }
    } else if (req.method == 'DELETE') {
      try {
        const response = await deleteComment(orgNumber, topicId, commentId, `${session?.accessToken}`);
        if (response.status !== 200) {
          return new Response('Failed to delete comment', { status: response.status });
        }
        return new Response('', { status: 200 });
      } catch (error) {
        return new Response('Failed to delete comment', { status: 500 });
      }
    } else {
      return new Response('Unauthorized', { status: 401 });
    }
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
