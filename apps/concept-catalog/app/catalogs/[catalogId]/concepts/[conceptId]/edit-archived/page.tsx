import { withWriteProtectedPage } from "@concept-catalog/utils/auth";
import { renderConceptEditPage } from "@concept-catalog/components/concept-form/edit-page-loader";

export default withWriteProtectedPage(
  ({ catalogId, conceptId }) =>
    `/catalogs/${catalogId}/concepts/${conceptId}/edit-archived`,
  async ({ catalogId, conceptId, session }) =>
    renderConceptEditPage({
      catalogId,
      conceptId: `${conceptId}`,
      session,
      mode: "archived",
    }),
);
