import { Service } from "@catalog-frontend/types";
import { uniqueString } from "./helpers";

/**
 * Satisfies the form's validation schema, not just the API:
 * - `evidence` is required by confirmedServiceSchema
 * - `identifier` must be the list index; the form rewrites it to the index on
 *   submit, before comparing against the initial values
 */
export const getRandomService = (prefix = "service"): Partial<Service> => ({
  id: undefined,
  catalogId: undefined,
  published: false,
  title: {
    nb: uniqueString(`${prefix}_title_nb`),
    nn: uniqueString(`${prefix}_title_nn`),
    en: uniqueString(`${prefix}_title_en`),
  },
  description: {
    nb: uniqueString(`${prefix}_description_nb`),
    nn: uniqueString(`${prefix}_description_nn`),
    en: uniqueString(`${prefix}_description_en`),
  },
  produces: [
    {
      identifier: "0",
      title: {
        nb: uniqueString(`${prefix}_produces_title_nb`),
        nn: uniqueString(`${prefix}_produces_title_nn`),
        en: uniqueString(`${prefix}_produces_title_en`),
      },
      description: {
        nb: uniqueString(`${prefix}_produces_description_nb`),
        nn: uniqueString(`${prefix}_produces_description_nn`),
        en: uniqueString(`${prefix}_produces_description_en`),
      },
    },
  ],
  evidence: [
    {
      identifier: "0",
      title: {
        nb: uniqueString(`${prefix}_evidence_title_nb`),
        nn: uniqueString(`${prefix}_evidence_title_nn`),
        en: uniqueString(`${prefix}_evidence_title_en`),
      },
      description: {
        nb: uniqueString(`${prefix}_evidence_description_nb`),
        nn: uniqueString(`${prefix}_evidence_description_nn`),
        en: uniqueString(`${prefix}_evidence_description_en`),
      },
    },
  ],
  contactPoints: [
    {
      category: {
        nb: uniqueString(`${prefix}_category_nb`),
        nn: uniqueString(`${prefix}_category_nn`),
        en: uniqueString(`${prefix}_category_en`),
      },
      email: `${uniqueString(prefix)}@example.com`,
      telephone: "+4712345678",
      contactPage: `https://${uniqueString(prefix)}.example.com`,
    },
  ],
  homepage: `https://${uniqueString(prefix)}.example.com`,
  spatial: [],
});
