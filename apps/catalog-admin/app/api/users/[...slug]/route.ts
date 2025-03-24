import { createUser, deleteUser, getUsers, patchUser } from '@catalog-frontend/data-access';
import { withValidSessionForApi } from '@catalog-frontend/utils';
import { NextRequest } from 'next/server';

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

export const GET = async (req: NextRequest, props: Props) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    const [catalogId] = slug;
    try {
      const response = await getUsers(catalogId, `${session?.accessToken}`);
      if (response.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get user list', { status: 500 });
    }
  });
};

export const POST = async (req: NextRequest, props: Props) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    const [catalogId] = slug;
    try {
      const { user } = await req.json();
      const response = await createUser(user, `${session?.accessToken}`, catalogId);
      if (response.status !== 201) {
        throw new Error();
      }
      return new Response('Created user', { status: response.status });
    } catch (error) {
      return new Response('Failed to create user', { status: 500 });
    }
  });
};

export const PATCH = async (req: NextRequest, props: Props) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    const [catalogId, userId] = slug;

    try {
      const { diff } = await req.json();
      const response = await patchUser(catalogId, userId, `${session?.accessToken}`, diff);
      if (response?.status !== 200) {
        throw new Error();
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to update user', { status: 500 });
    }
  });
};

export const DELETE = async (req: NextRequest, props: Props) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { slug } = params;
    const [catalogId, userId] = slug;
    try {
      const response = await deleteUser(catalogId, userId, `${session?.accessToken}`);
      if (response.status !== 204) {
        throw new Error();
      }
      return new Response('User deleted', { status: 200 });
    } catch (error) {
      return new Response('Failed to delete user', { status: 500 });
    }
  });
};
