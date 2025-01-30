import { CodeList } from '@catalog-frontend/types';
import { convertCodeListToTreeNodes, getPath, getTranslateText } from '@catalog-frontend/utils';
import { Link } from '@digdir/designsystemet-react';
import styles from './codelist-code-links.module.scss';

type CodeListCodeLinksProps = {
  codeList: CodeList | undefined;
  codes: string[] | undefined;
  catalogId: string;
  lang?: string | undefined;
};

export const CodeListCodeLinks = ({ codeList, codes, catalogId, lang = 'nb' }: CodeListCodeLinksProps) => {
  if (codeList && codes?.length) {
    return (
      <ul className={styles.list}>
        {codes.map((codeId, index) => {
          const path = getPath(convertCodeListToTreeNodes(codeList?.codes), codeId)
            ;
          return (
            <li key={`code-${index}`}>
              {index > 0 && ', '}
              <Link
                href={`/catalogs/${catalogId}/concepts?filter.subject=${path.map((item) => item.value).join(',')}`}
                title={path.map((item) => item.label).join(' - ')}
              >
                {getTranslateText(codeList.codes?.find((c) => c.id === codeId)?.name, lang)}
              </Link>
              
            </li>
          );
        })}
      </ul>
    );
  }
};
