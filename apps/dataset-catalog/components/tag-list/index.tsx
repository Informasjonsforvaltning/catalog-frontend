import { Tag } from "@digdir/designsystemet-react";
import styles from "./tagList.module.css";

type TagListProps = {
  values: string[] | undefined;
  getTagText: (item: string) => string | string[] | undefined | null;
};

const TagList = ({ values, getTagText }: TagListProps) => {
  if (!values || values.length === 0) return null;

  return (
    <ul className={styles.list}>
      {values.map((item, index) => {
        const label = getTagText(item);
        if (label) {
          return (
            <li key={index}>
              <Tag data-size="sm" data-color="info">
                {label}
              </Tag>
            </li>
          );
        }

        return null;
      })}
    </ul>
  );
};

export default TagList;
