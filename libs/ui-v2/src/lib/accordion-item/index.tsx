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
    <Details open={isOpen} onToggle={() => setIsOpen(!isOpen)} role="group">
      <Details.Summary
        role="button"
        slot="summary"
        tabIndex={0}
        aria-expanded={isOpen}
      >
        {header}
      </Details.Summary>
      <Details.Content>{content}</Details.Content>
    </Details>
  );
};

export { AccordionItem };
