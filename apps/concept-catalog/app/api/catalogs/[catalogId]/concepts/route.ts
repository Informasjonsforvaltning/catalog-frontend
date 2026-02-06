import {
  createConcept,
  getConceptsForCatalog,
} from "@catalog-frontend/data-access";
import { Concept } from "@catalog-frontend/types";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ catalogId: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { catalogId } = params;

    try {
      const response = await getConceptsForCatalog(
        catalogId,
        session.accessToken,
      );
      if (response.status !== 200) {
        throw new Error();
      }
      const concepts = await response.json();
      return new Response(JSON.stringify(concepts), { status: 200 });
    } catch (err) {
      return new Response(
        JSON.stringify({ message: "Failed to fetch concepts" }),
        { status: 500 },
      );
    }
  });
};

export const POST = async (
  req: NextRequest,
  props: { params: Promise<{ catalogId: string }> },
) => {
  const params = await props.params;
  return await withValidSessionForApi(async (session) => {
    const { catalogId } = params;

    const concept: Concept = await req.json();
    concept.ansvarligVirksomhet = {
      id: catalogId,
    };

    try {
      const response = await createConcept(concept, session.accessToken);
      if (response.status !== 201) {
        console.log(
          "Failed to create concept with status " + response.status,
          await response.json(),
        );
        throw new Error(
          "Failed to create concept with status " + response.status,
        );
      }
      const conceptId = response?.headers?.get("location")?.split("/").pop();
      return new Response(JSON.stringify(conceptId), { status: 200 });
    } catch (err) {
      console.log(err);
      return new Response(
        JSON.stringify({ message: "Failed to create concept" }),
        { status: 500 },
      );
    }
  });
};
