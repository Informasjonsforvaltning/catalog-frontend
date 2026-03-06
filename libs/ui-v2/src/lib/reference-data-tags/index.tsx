import { Tag } from "@digdir/designsystemet-react";
import { ReferenceDataCode } from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
} from "@catalog-frontend/utils";
import styles from "./referenceDataTags.module.css";

type Props = {
  values?: string[] | string;
  data?: ReferenceDataCode[];
};

export const ReferenceDataTags = ({ values, data }: Props) => {
  const dataMap = new Map(data?.map((item) => [item.uri, item.label]));

  const renderTag = (uri: string) => {
    const label = dataMap.get(uri);
    const displayText = capitalizeFirstLetter(getTranslateText(label) || uri);
    return (
      <Tag data-size="sm" data-color="info" key={uri}>
        {displayText}
      </Tag>
    );
  };

  if (!values) {
    return null;
  }

  if (typeof values === "string") {
    return <>{renderTag(values)}</>;
  }

  return (
    <ul className={styles.list}>
      {values?.map((item) => item && renderTag(item))}
    </ul>
  );
};
