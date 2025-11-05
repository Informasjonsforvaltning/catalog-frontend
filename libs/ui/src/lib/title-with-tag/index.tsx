import { Label, Tag, TagProps } from "@digdir/designsystemet-react";
import styles from "./title-with-tag.module.css";
import { ReactNode } from "react";

interface Props {
  title: ReactNode | string;
  tagTitle?: string;
  tagColor?: TagProps["color"];
  tagSize?: TagProps["size"];
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
        <Label size={tagSize}>{title}</Label>
      ) : (
        title
      )}
      {tagTitle && (
        <Tag color={tagColor} size={tagSize}>
          {tagTitle}
        </Tag>
      )}
    </div>
  );
}

export default TitleWithTag;
