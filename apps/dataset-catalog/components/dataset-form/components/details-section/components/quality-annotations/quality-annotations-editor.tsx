"use client";

import { DeleteButton, TitleWithHelpTextAndTag } from "@catalog-frontend/ui";
import {
  Dataset,
  ISOLanguage,
  QualityAnnotation,
  QualityDimension,
} from "@catalog-frontend/types";
import { getTranslateText, localization } from "@catalog-frontend/utils";
import { Card, Paragraph, Tag } from "@digdir/designsystemet-react";
import { useFormikContext } from "formik";
import {
  emptyQualityAnnotation,
  getQualityDimensionLabel,
} from "@dataset-catalog/utils/quality-annotations";
import { QualityAnnotationsModal } from "./quality-annotations-modal";
import styles from "./quality-annotations.module.css";

type Props = {
  qualityDimensions?: QualityDimension[];
};

const ALLOWED_LANGUAGES = Object.freeze<ISOLanguage[]>(["nb", "nn", "en"]);

export const QualityAnnotationsEditor = ({ qualityDimensions }: Props) => {
  const { values, setFieldValue } = useFormikContext<Dataset>();
  const annotations = values.qualityAnnotations ?? [];

  const setAnnotations = (next: QualityAnnotation[] | undefined) =>
    setFieldValue("qualityAnnotations", next?.length ? next : undefined);

  const appendAnnotation = (item: QualityAnnotation) =>
    setAnnotations([...annotations, item]);

  const replaceAnnotation = (index: number, item: QualityAnnotation) =>
    setAnnotations(annotations.map((a, i) => (i === index ? item : a)));

  const removeAnnotation = (index: number) =>
    setAnnotations(annotations.filter((_, i) => i !== index));

  return (
    <div className={styles.fieldContainer}>
      <TitleWithHelpTextAndTag
        helpText={localization.datasetForm.helptext.qualityAnnotations}
      >
        {localization.datasetForm.fieldLabel.qualityAnnotations}
      </TitleWithHelpTextAndTag>

      {annotations.map((item, i) => (
        <Card key={`quality-annotation-card-${i}`} data-color="neutral">
          <Card.Block className={styles.annotationContent}>
            <div className={styles.annotationBody}>
              <Paragraph>{getTranslateText(item.hasBody)}</Paragraph>
              {!!item.inDimension?.length && (
                <div className={styles.dimensionTags}>
                  {item.inDimension.map((uri) => (
                    <Tag data-size="sm" data-color="info" key={uri}>
                      {getQualityDimensionLabel(uri, qualityDimensions)}
                    </Tag>
                  ))}
                </div>
              )}
              <div className={styles.dimensionTags}>
                {ALLOWED_LANGUAGES.filter(
                  (lang) =>
                    item.hasBody &&
                    Object.prototype.hasOwnProperty.call(item.hasBody, lang),
                ).map((lang) => (
                  <Tag key={lang} data-color="info">
                    {localization.language[lang]}
                  </Tag>
                ))}
              </div>
            </div>
            <div className={styles.actions}>
              <QualityAnnotationsModal
                template={item}
                type="edit"
                qualityDimensions={qualityDimensions}
                onSuccess={(updatedItem) => replaceAnnotation(i, updatedItem)}
              />
              <DeleteButton onClick={() => removeAnnotation(i)} />
            </div>
          </Card.Block>
        </Card>
      ))}

      <div>
        <QualityAnnotationsModal
          template={emptyQualityAnnotation()}
          type="new"
          qualityDimensions={qualityDimensions}
          onSuccess={appendAnnotation}
        />
      </div>
    </div>
  );
};
