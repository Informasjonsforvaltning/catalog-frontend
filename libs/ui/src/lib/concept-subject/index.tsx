import { CodeList, Concept } from '@catalog-frontend/types';
import { getConceptSubject } from '@catalog-frontend/utils';
import cn from 'classnames';
import styles from './concept-subject.module.css';

interface Props {
  concept: Concept;
  subjectCodeList?: CodeList;
  className?: string;
}

export const ConceptSubject = ({ concept, subjectCodeList, className }: Props) => {
  return <p className={cn(styles.subject, className)}>{getConceptSubject(concept, subjectCodeList)}</p>;
};

export default ConceptSubject;
