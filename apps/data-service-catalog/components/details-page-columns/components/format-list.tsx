import { Tag } from '@digdir/designsystemet-react';
import { useSearchFileTypeByUri } from '../../../hooks/useReferenceDataSearch';
import { getTranslateText } from '@catalog-frontend/utils';
import styles from '../details-columns.module.css';

type Props = {
  formatURIs: string[] | undefined;
  referenceDataEnv: string;
  language: string;
};

export const FormatList = ({ formatURIs, referenceDataEnv, language }: Props) => {
  const { data: fileTypes } = useSearchFileTypeByUri(formatURIs || [], referenceDataEnv);

  const matchFileType = (uri: string) => fileTypes?.find((s) => s.uri === uri);

  return (
    <li className={styles.list}>
      {formatURIs?.map((uri, index) => {
        return (
          <Tag
            data-size='sm'
            color='info'
            key={`format-${index}`}
          >
            {getTranslateText(matchFileType(uri)?.label, language) || uri}
          </Tag>
        );
      })}
    </li>
  );
};
