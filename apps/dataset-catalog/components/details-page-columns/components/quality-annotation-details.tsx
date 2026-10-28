"use client";

import { FieldsetDivider } from "@catalog-frontend/ui";
import { getTranslateText } from "@catalog-frontend/utils";
import { Card, Paragraph, Tag } from "@digdir/designsystemet-react";
import { Fragment } from "react";
import { QualityAnnotationDisplayItem } from "./get-quality-annotations";
import styles from "../details-columns.module.css";

type Props = {
  qualityAnnotations: QualityAnnotationDisplayItem[];
  language?: string;
};

export const QualityAnnotationDetails = ({
  qualityAnnotations,
  language,
}: Props) => {
  if (!qualityAnnotations.length) {
    return null;
  }

  return (
    <Card data-color="neutral">
      <Card.Block className={styles.annotationList}>
        {qualityAnnotations.map((annotation, index) => (
          <Fragment key={`quality-annotation-details-${index}`}>
            {index > 0 && <FieldsetDivider />}
            <div className={styles.annotationItem}>
              <Paragraph data-size="sm">
                {getTranslateText(annotation.hasBody, language)}
              </Paragraph>
              {annotation.dimensionLabels.length > 0 && (
                <div className={styles.dimensionTags}>
                  {annotation.dimensionLabels.map((label) => (
                    <Tag data-size="sm" data-color="info" key={label}>
                      {label}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          </Fragment>
        ))}
      </Card.Block>
    </Card>
  );
};
