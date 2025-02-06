import { CodeList, Concept } from '@catalog-frontend/types';
import cn from 'classnames';
import styles from './concept-subject.module.css';
import { CodeListCodeLinks } from '../codelist-code-links';
import { ensureStringArray, getTranslateText } from '@catalog-frontend/utils';

interface Props {
  concept: Concept;
  subjectCodeList?: CodeList;
  className?: string;
}

export const ConceptSubject = ({ concept, subjectCodeList, className }: Props) => {
  return (
    <div className={cn(styles.subject, className)}>
      {subjectCodeList && concept.fagområdeKoder ? (
        <CodeListCodeLinks
          codeList={subjectCodeList}
          codes={concept?.fagområdeKoder}
          catalogId={concept.ansvarligVirksomhet.id}
        />
      ) : (
        ensureStringArray(getTranslateText(concept.fagområde)).join(', ')
      )}
    </div>
  );
};

export default ConceptSubject;
