import { Accordion } from '@digdir/design-system-react';
import { uniqueId } from 'lodash';
import React, { ReactNode, useState } from 'react';

export type AccordionItemProps = {
  header: string;
  content: ReactNode;
};
const AccordionItem = ({ header, content }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Accordion.Item
      key={`accordion-item-${uniqueId()}`}
      open={isOpen}
    >
      <Accordion.Header onHeaderClick={() => setIsOpen(!isOpen)}>{header}</Accordion.Header>
      <Accordion.Content>{content}</Accordion.Content>
    </Accordion.Item>
  );
};

export { AccordionItem };
