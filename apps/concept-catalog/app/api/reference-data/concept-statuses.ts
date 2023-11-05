import { getConceptStatuses } from '@catalog-frontend/data-access';
import { NextRequest } from 'next/server';

export async function handler(req: NextRequest) {
  if (req.method == 'GET') {
    try {
      const response = await getConceptStatuses();
      if (response.status !== 200) {
        return new Response('Failed to get concept statuses', { status: response.status });
      }
      const jsonResponse = await response.json();
      return new Response(JSON.stringify(jsonResponse), { status: response.status });
    } catch (error) {
      return new Response('Failed to get concept statuses', { status: 500 });
    }
  } else {
    return new Response('', { status: 400 });
  }
}
