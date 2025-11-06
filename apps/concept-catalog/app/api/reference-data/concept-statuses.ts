import { getConceptStatuses } from "@catalog-frontend/data-access";

export async function GET() {
  try {
    const response = await getConceptStatuses();
    if (response.status !== 200) {
      throw new Error();
    }
    const jsonResponse = await response.json();
    return new Response(JSON.stringify(jsonResponse), {
      status: response.status,
    });
  } catch {
    return new Response(
      JSON.stringify({ message: "Failed to get concept statuses" }),
      { status: 500 },
    );
  }
}
