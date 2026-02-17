import { Label, Tag, TagProps } from "@digdir/designsystemet-react";
import styles from "./title-with-tag.module.css";
import { ReactNode } from "react";

interface Props {
  title: ReactNode | string;
  tagTitle?: string;
  tagColor?: TagProps["data-color"];
  tagSize?: TagProps["data-size"];
}

export function TitleWithTag({
  title,
  tagTitle,
  tagColor = "warning",
  tagSize = "sm",
}: Props) {
  return (
    <div className={styles.container}>
      {typeof title === "string" ? (
        <Label data-size={tagSize}>{title}</Label>
      ) : (
        title
      )}
      {tagTitle && (
        <Tag data-color={tagColor} data-size={tagSize}>
          {tagTitle}
        </Tag>
      )}
    </div>
  );
}

export default TitleWithTag;
