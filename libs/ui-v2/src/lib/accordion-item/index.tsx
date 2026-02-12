"use client";

import { Details } from "@digdir/designsystemet-react";
import { ReactNode, useState } from "react";

export type AccordionItemProps = {
  header: ReactNode;
  content: ReactNode;
  initiallyOpen?: boolean;
};

const AccordionItem = ({
  header,
  content,
  initiallyOpen = false,
}: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <Details open={isOpen} onToggle={() => setIsOpen(isOpen)}>
      <Details.Summary>{header}</Details.Summary>
      <Details.Content>{content}</Details.Content>
    </Details>
  );
};

export { AccordionItem };
