import { Tag } from "@digdir/designsystemet-react";
import { getTranslateText } from "@catalog-frontend/utils";
import styles from "../details-columns.module.css";
import { useSearchFileTypeByUri } from "@catalog-frontend/ui";

type Props = {
  formatURIs: string[] | undefined;
  language: string;
};

export const FormatList = ({ formatURIs, language }: Props) => {
  const { data: fileTypes } = useSearchFileTypeByUri(formatURIs || []);

  const matchFileType = (uri: string) => fileTypes?.find((s) => s.uri === uri);

  return (
    <li className={styles.list}>
      {formatURIs?.map((uri, index) => {
        return (
          <Tag data-color="info" key={`format-${index}`}>
            {getTranslateText(matchFileType(uri)?.label, language) || uri}
          </Tag>
        );
      })}
    </li>
  );
};
