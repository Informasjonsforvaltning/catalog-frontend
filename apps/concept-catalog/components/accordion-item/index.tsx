import { Accordion } from '@digdir/design-system-react';
import React, { ReactNode, useState } from 'react';

export type AccordionItemProps = {
  header: ReactNode;
  content: ReactNode;
  initiallyOpen?: boolean;
};

const AccordionItem = ({ header, content, initiallyOpen = false }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <Accordion.Item open={isOpen}>
      <Accordion.Header onHeaderClick={() => setIsOpen(!isOpen)}>{header}</Accordion.Header>
      <Accordion.Content>{content}</Accordion.Content>
    </Accordion.Item>
  );
};

export { AccordionItem };
