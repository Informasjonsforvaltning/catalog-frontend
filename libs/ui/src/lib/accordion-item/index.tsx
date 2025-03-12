'use client';

import { Accordion } from '@digdir/designsystemet-react';
import { ReactNode, useState } from 'react';

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
