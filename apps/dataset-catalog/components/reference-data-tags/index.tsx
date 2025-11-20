import { ReferenceDataCode } from "@catalog-frontend/types";
import {
  capitalizeFirstLetter,
  getTranslateText,
} from "@catalog-frontend/utils";
import { Tag } from "@digdir/designsystemet-react";
import styles from "./referenceDataTags.module.css";

type Props = {
  values: string[] | string | undefined;
  data: ReferenceDataCode[] | undefined;
};

export const ReferenceDataTags = ({ values, data }: Props) => {
  if (!values) {
    return null;
  }

  const dataMap = new Map(data?.map((item) => [item.uri, item.label]));

  const renderTag = (uri: string) => {
    const label = dataMap.get(uri);
    const displayText = capitalizeFirstLetter(
      getTranslateText(label)?.toString() || uri,
    );
    return (
      <Tag size="sm" color="info" key={uri}>
        {displayText}
      </Tag>
    );
  };

  if (typeof values === "string") {
    return <>{renderTag(values)}</>;
  }

  return (
    <ul className={styles.list}>
      {values?.map((item) => item && renderTag(item))}
    </ul>
  );
};
