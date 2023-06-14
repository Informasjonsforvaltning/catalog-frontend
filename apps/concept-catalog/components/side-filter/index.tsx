import { Accordion } from '@digdir/design-system-react';
import { memo } from 'react';
import { action, useSearchDispatch } from '../../context/search';
import { PublishedFilterType, StatusFilterType } from '../../context/search/state';
import { localization as loc } from '@catalog-frontend/utils';
import styles from './side-filter.module.css';
import { createCheckboxGroup } from './checkbox-group-generator';
import { uniqueId } from 'lodash';
import { AccordionItem, AccordionItemProps } from './accordion-item';

const SideFilter = () => {
  const searchDispatch = useSearchDispatch();

  const statusLabels = ['Utkast', 'Høring', 'Kvalitetssikret', 'Godkjent'];
  const nameAndConceptLabels = ['Egenskapsnavn', 'Forretningsbegrep'];
  const publicationState = ['Publisert', 'Ikke publisert'];

  const handleOnStatusChange = (names: string[]) =>
    searchDispatch(
      action('SET_CONCEPT_STATUS', { filters: { status: names.map((name) => name as StatusFilterType) } }),
    );

  const handleOnNameAndConceptChange = (names: string[]) =>
    searchDispatch(action('SET_NAME_AND_CONCEPT', { filters: {} }));

  const handlePublicationOnChange = (names: string[]) =>
    searchDispatch(
      action('SET_PUBLICATION_STATE', { filters: { published: names.map((name) => name as PublishedFilterType) } }),
    );

  const NameAndConcept = createCheckboxGroup('NameAndConcept', nameAndConceptLabels, handleOnNameAndConceptChange);
  const ConceptStatus = createCheckboxGroup('ConceptStatus', statusLabels, handleOnStatusChange);
  const PublicationState = createCheckboxGroup('PublicationState', publicationState, handlePublicationOnChange);

  const accordionItemContents: AccordionItemProps[] = [
    {
      header: loc.subjectArea,
      content: <div>Accordion content</div>,
    },
    {
      header: loc.conceptStatus,
      content: <ConceptStatus />,
    },
    {
      header: loc.assigned,
      content: <div>Accordion content</div>,
    },
    {
      header: loc.publicationState,
      content: (
        <>
          <p>
            {loc.publicationStateDescription}
            <br />
            <br />
          </p>
          <PublicationState />
        </>
      ),
    },
    {
      header: loc.nameAndConcept,
      content: <NameAndConcept />,
    },
  ];

  const accordionItems = accordionItemContents.map((item) => (
    <AccordionItem
      key={`accordion-item-${uniqueId()}`}
      {...item}
    />
  ));

  return (
    <div className={styles.sideFilter}>
      <Accordion
        border={true}
        className={styles.accordion}
      >
        {accordionItems}
      </Accordion>
    </div>
  );
};

export default memo(SideFilter);
