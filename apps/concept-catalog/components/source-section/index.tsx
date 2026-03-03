"use client";

import { FC } from "react";
import style from "./source-section.module.css";
import { localization } from "@catalog-frontend/utils";
import { Definisjon } from "@catalog-frontend/types";
import { FieldArray } from "formik";
import { SourceForDefinitionField } from "./source-for-definition";
import { PlusCircleIcon } from "@navikt/aksel-icons";
import { RelationToSource } from "./relation-to-source";
import { Button } from "@catalog-frontend/ui-v2";

interface Props {
  fieldName: string;
  definisjon?: Definisjon;
  readOnly: boolean;
}

export const SourceSection: FC<Props> = ({
  fieldName,
  definisjon,
  readOnly,
}) => {
  const forholdTilKilde = definisjon?.kildebeskrivelse?.forholdTilKilde;

  return (
    <div className={style.container}>
      <RelationToSource
        readOnly={readOnly}
        fieldName={`${fieldName}.forholdTilKilde`}
      />
      {forholdTilKilde && forholdTilKilde !== "egendefinert" && (
        <FieldArray name={`${fieldName}.kilde`}>
          {(arrayHelpers) => (
            <>
              <div className={style.listContainer}>
                {definisjon?.kildebeskrivelse?.kilde?.map((_, index) => (
                  <SourceForDefinitionField
                    key={`${index}`}
                    sourceTitleFieldName={`${fieldName}.kilde[${index}].tekst`}
                    sourceUriFieldName={`${fieldName}.kilde[${index}].uri`}
                    deleteClickHandler={() => arrayHelpers.remove(index)}
                    readOnly={readOnly}
                  />
                ))}
              </div>
              <div>
                {!readOnly && (
                  <Button
                    data-color="second"
                    variant="tertiary"
                    onClick={() => arrayHelpers.push({ uri: "", tekst: "" })}
                  >
                    <>
                      <PlusCircleIcon />
                      {localization.formatString(
                        localization.button.addWithFormat,
                        {
                          text: localization.concept.source.toLowerCase(),
                        },
                      )}
                    </>
                  </Button>
                )}
              </div>
            </>
          )}
        </FieldArray>
      )}
    </div>
  );
};
