import { createUser, deleteUser, getUsers, patchUser } from '@catalog-frontend/data-access';
import { authOptions } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

interface Props {
  params: {
    slug: string[];
  };
}

export async function handler(req: NextRequest, { params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session || session?.accessTokenExpiresAt < Date.now() / 1000) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { slug } = params;
  const [catalogId, userId] = slug;

  if (req.method == 'GET') {
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
  } else if (req.method == 'POST') {
    try {
      const { user } = JSON.parse(await req.json());
      const response = await createUser(user, `${session?.accessToken}`, catalogId);
      if (response.status !== 200) {
        return new Response('Failed to create user', { status: response.status });
      }

      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to create user', { status: 500 });
    }
  } else if (req.method == 'PATCH') {
    try {
      const { diff } = JSON.parse(await req.json());
      const response = await patchUser(catalogId, userId, `${session?.accessToken}`, diff);
      if (response?.status !== 200) {
        return new Response('Failed to update user', { status: response?.status });
      }

      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to update user', { status: 500 });
    }
  } else if (req.method == 'DELETE') {
    try {
      const response = await deleteUser(catalogId, userId, `${session?.accessToken}`);
      if (response.status !== 200) {
        return new Response('Failed to delete user', { status: response.status });
      }

      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to delete user', { status: 500 });
    }
  } else {
    return new Response('', { status: 400 });
  }
}

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
