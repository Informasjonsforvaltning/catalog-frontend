import { CodeList, Concept } from '@catalog-frontend/types';
import { convertCodeListToTreeNodes, ensureStringArray, getPath, getTranslateText } from '@catalog-frontend/utils';
import cn from 'classnames';
import styles from './concept-subject.module.css';

interface Props {
  concept: Concept;
  subjectCodeList?: CodeList;
  className?: string;
}

export const ConceptSubject = ({ concept, subjectCodeList, className }: Props) => {
  if (subjectCodeList && concept?.fagområdeKoder?.[0]) {
    const path = getPath(convertCodeListToTreeNodes(subjectCodeList), concept.fagområdeKoder[0]);
    return <p className={cn(styles.subject, className)}>{path.map((item) => item.label).join(' - ')}</p>;
  }

  return (
    <p className={cn(styles.subject, className)}>{ensureStringArray(getTranslateText(concept.fagområde)).join(' ')}</p>
  );
};

export default ConceptSubject;
