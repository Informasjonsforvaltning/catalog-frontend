"use server";

import {
  deleteConcept as deleteConceptApi,
  createConcept as createConceptApi,
  patchConcept as patchConceptApi,
  getConcept,
  removeImportResultConcept as removeImportResult,
  cancelConceptImport,
  confirmImportedConcept,
} from "@catalog-frontend/data-access";
import { Concept, InternalField } from "@catalog-frontend/types";
import {
  getValidSession,
  localization,
  redirectToSignIn,
  removeEmptyValues,
} from "@catalog-frontend/utils";
import _ from "lodash";
import { updateTag } from "next/cache";
import { conceptJsonPatchOperations } from "@concept-catalog/utils/json-patch";

const clearValues = (object: Concept, path: string): void => {
  const fields = path.split(".");
  const currentField = fields.shift();

  if (object && currentField) {
    if (currentField.endsWith("[]")) {
      const value = _.get(object, currentField.replace("[]", ""));
      if (_.isArray(value)) {
        _.forEach(value, (item) => {
          clearValues(item, fields.join("."));
        });
      }
    } else if (currentField === "*") {
      if (fields.length > 0) {
        Object.keys(object).forEach((key) =>
          clearValues(_.get(object, key), fields.join(".")),
        );
      } else {
        Object.keys(object).forEach((key) => {
          const value = _.get(object, key);
          if (value !== undefined && _.isEmpty(value)) {
            _.set(object, key, null);
          }
        });
      }
    } else if (fields.length > 0) {
      clearValues(object[currentField], fields.join("."));
    } else {
      const value = _.get(object, currentField);
      if (value !== undefined && _.isEmpty(value)) {
        _.set(object, currentField, null);
      }
    }
  }
};

const preProcessValues = (
  orgId: string,
  {
    ansvarligVirksomhet,
    merknad,
    eksempel,
    fagområde,
    omfang,
    kontaktpunkt,
    ...conceptValues
  }: Concept,
): Concept => ({
  ...conceptValues,
  merknad,
  eksempel,
  omfang: removeEmptyValues(omfang),
  kontaktpunkt: removeEmptyValues(kontaktpunkt),
  ansvarligVirksomhet: ansvarligVirksomhet || { id: orgId },
});

export async function createConcept(
  values: Concept,
  catalogId: string,
  internalFields: InternalField[],
): Promise<string | undefined> {
  const processedValues = preProcessValues(catalogId, values);
  internalFields.forEach((field) => {
    if (
      field.type === "boolean" &&
      values.interneFelt?.[field.id]?.value === undefined
    ) {
      // Ensure interneFelt is defined before assignment
      values.interneFelt = values.interneFelt || {};
      values.interneFelt[field.id] = { value: "false" };
    }
  });

  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  let conceptId: string | undefined = undefined;
  try {
    const response = await createConceptApi(
      processedValues,
      session.accessToken,
    );
    if (response.status !== 201) {
      throw new Error();
    }
    conceptId = response.headers.get("location")?.split("/").pop();
    success = true;
  } catch (error) {
    console.error(error);
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      updateTag("concept");
      updateTag("concepts");
    }
  }

  return conceptId;
}

export async function deleteConcept(conceptId: string): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await deleteConceptApi(conceptId, session.accessToken);
    if (response.status !== 200) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    console.error(error);
    throw new Error(localization.alert.deleteFailed);
  } finally {
    if (success) {
      updateTag("concepts");
    }
  }
}

export async function updateConcept(
  initialConcept: Concept,
  values: Concept,
  internalFields: InternalField[],
): Promise<Concept> {
  if (!initialConcept.id) {
    throw new Error("Concept id cannot be null");
  }

  let conceptId: string | undefined = initialConcept.id;

  [
    "definisjon.kildebeskrivelse.kilde[].uri",
    "definisjonForAllmennheten.kildebeskrivelse.kilde[].uri",
    "definisjonForSpesialister.kildebeskrivelse.kilde[].uri",
    "gyldigFom",
    "gyldigTom",
    "kontaktpunkt.harEpost",
    "kontaktpunkt.harTelefon",
    "interneFelt.*.value",
    "omfang.*",
  ].forEach((field) => {
    clearValues(values, field);
  });

  internalFields.forEach((field) => {
    if (
      field.type === "boolean" &&
      values.interneFelt?.[field.id]?.value === undefined
    ) {
      // Ensure interneFelt is defined before assignment
      values.interneFelt = values.interneFelt || {};
      values.interneFelt[field.id] = { value: "false" };
    }
  });

  const diff = conceptJsonPatchOperations(initialConcept, values);

  if (diff.length === 0) {
    return initialConcept;
  }

  let success = false;
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }

  try {
    const response = await patchConceptApi(
      initialConcept.id,
      diff,
      session.accessToken,
    );
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    success = true;
    if (response.status === 201) {
      conceptId = response.headers.get("location")?.split("/").pop();
    }
  } catch (error) {
    console.error(`${localization.alert.fail} ${error}`);
    throw new Error("Noe gikk galt, prøv igjen...");
  }

  if (success) {
    updateTag("concept");
    updateTag("concepts");
  }

  return await getConcept(`${conceptId}`, session.accessToken).then(
    (response) => (response.ok ? response.json() : undefined),
  );
}

export async function deleteImportResult(
  catalogId: string,
  resultId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await removeImportResult(
      catalogId,
      resultId,
      session.accessToken,
    );
    if (response.status !== 204) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.deleteFailed);
  } finally {
    if (success) {
      updateTag("import-results");
    }
  }
}

export async function saveImportedConcept(
  catalogId: string,
  resultId: string,
  externalId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  try {
    const response = await confirmImportedConcept(
      catalogId,
      resultId,
      externalId,
      session.accessToken,
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error();
    }
  } catch (error) {
    console.error(error);
  } finally {
    updateTag("import-result");
    updateTag("import-results");
  }
}

export async function cancelImport(
  catalogId: string,
  resultId: string,
): Promise<void> {
  const session = await getValidSession();
  if (!session) {
    return redirectToSignIn();
  }
  let success = false;
  try {
    const response = await cancelConceptImport(
      catalogId,
      resultId,
      session.accessToken,
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error();
    }
    success = true;
  } catch (error) {
    throw new Error(localization.alert.fail);
  } finally {
    if (success) {
      updateTag("import-result");
      updateTag("import-results");
    }
  }
}
