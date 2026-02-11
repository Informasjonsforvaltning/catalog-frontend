import { deleteConcept } from "@catalog-frontend/data-access";
import { withValidSessionForApi } from "@catalog-frontend/utils";
import { NextRequest } from "next/server";

export const DELETE = async (req: NextRequest, props) => {
  const params = await props.params;
  return withValidSessionForApi(async (session) => {
    const { conceptId } = params;
    try {
      const response = await deleteConcept(conceptId, session.accessToken);
      if (!response.ok) {
        throw new Error();
      }
      return new Response(await response.text(), { status: 200 });
    } catch (err) {
      console.log("Error", err);
      return new Response(
        JSON.stringify({ message: "Failed to delete concept" }),
        { status: 500 },
      );
    }
  });
};
