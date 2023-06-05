import { Accordion } from '@digdir/design-system-react';
import { uniqueId } from 'lodash';
import { ReactNode } from 'react';
import { localization } from '@catalog-frontend/utils';
import styles from './side-filter.module.css';

type AccordionItem = {
  header: string;
  content: ReactNode;
};

const accordionItemContents: AccordionItem[] = [
  {
    header: localization.subjectArea,
    content: <div>Accordion content</div>,
  },
  {
    header: localization.conceptStatus,
    content: <div>Accordion content</div>,
  },
  {
    header: localization.assigned,
    content: <div>Accordion content</div>,
  },
  {
    header: localization.publicationState,
    content: <div>Accordion content</div>,
  },
  {
    header: localization.nameAndConcept,
    content: <div>Accordion content</div>,
  },
];

const accordionItems = accordionItemContents.map((item, i) => {
  return (
    <Accordion.Item
      key={uniqueId()}
      className={i === 0 && styles.accordionFirstItem}
    >
      <Accordion.Header>{item.header}</Accordion.Header>
      <Accordion.Content>{item.content}</Accordion.Content>
    </Accordion.Item>
  );
});

const SideFilter = () => {
  return (
    <div className={styles.sideFilter}>
      <Accordion className={styles.accordion}>{accordionItems}</Accordion>
    </div>
  );
};

export default SideFilter;
