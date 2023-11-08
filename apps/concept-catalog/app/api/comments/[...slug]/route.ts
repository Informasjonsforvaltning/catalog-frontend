import { createComment, deleteComment, getComments, updateComment } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  await validateSession(session);

  const { slug } = params;

  if (slug?.length >= 2 && slug?.length <= 3) {
    const [orgNumber, topicId] = slug;
    try {
      const response = await getComments(orgNumber, topicId, `${session?.accessToken}`);
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get comments', { status: 500 });
    }
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  if (slug?.length >= 2 && slug?.length <= 3) {
    const { comment } = await req.json();
    const [orgNumber, topicId] = slug;
    try {
      const response = await createComment(orgNumber, topicId, comment, `${session?.accessToken}`);
      if (response.status !== 201) {
        throw new Error();
      }
      return new Response('Created comment', { status: response.status });
    } catch (error) {
      return new Response('Failed to create comment', { status: 500 });
    }
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  if (slug?.length >= 2 && slug?.length <= 3) {
    const [orgNumber, topicId, commentId] = slug;
    const { comment } = await req.json();
    try {
      const response = await updateComment(orgNumber, topicId, commentId, comment, `${session?.accessToken}`);
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to update comment', { status: 500 });
    }
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  if (slug?.length >= 2 && slug?.length <= 3) {
    const [orgNumber, topicId, commentId] = slug;
    try {
      const response = await deleteComment(orgNumber, topicId, commentId, `${session?.accessToken}`);
      if (response.status !== 204) {
        throw new Error();
      }
      return new Response('Comment deleted', { status: 200 });
    } catch (error) {
      return new Response('Failed to delete comment', { status: 500 });
    }
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}
