import { createChangeRequest, getChangeRequests, updateChangeRequest } from '@catalog-frontend/data-access';
import { authOptions, validateSession } from '@catalog-frontend/utils';
import { getServerSession } from 'next-auth';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId] = slug;

  try {
    const response = await getChangeRequests(`${catalogId}`, `${session?.accessToken}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), { status: response.status });
  } catch (error) {
    return new Response('Failed to get change requests', { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId] = slug;
  try {
    const reqBody = await req.json();
    const response = await createChangeRequest(reqBody, `${catalogId}`, `${session?.accessToken}`);
    if (response.status !== 201) {
      throw new Error(
        `Error when creating change request. Response status: ${response.status}, message: ${await response.text()}`,
      );
    }
    const changeRequestId = response?.headers?.get('location')?.split('/').pop();
    return new Response(JSON.stringify(changeRequestId), { status: response.status });
  } catch (error) {
    console.error(error);
    return new Response('Failed to create change request', { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const session = await getServerSession(authOptions);
  await validateSession(session);
  const { slug } = params;
  const [catalogId, changeRequestId] = slug;

  try {
    const reqBody = await req.json();
    const response = await updateChangeRequest(
      reqBody,
      `${catalogId}`,
      `${changeRequestId}`,
      `${session?.accessToken}`,
    );
    if (response.status !== 200) {
      throw new Error(
        `Error when updating change request. Response status: ${response.status}, message: ${await response.text()}`,
      );
    }
    return new Response('Updated change requests', { status: response.status });
  } catch (error) {
    console.error(error);
    return new Response('Failed to update change request', { status: 500 });
  }
};
