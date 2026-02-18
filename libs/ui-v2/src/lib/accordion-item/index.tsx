"use client";

import { Details } from "@digdir/designsystemet-react";
import { ReactNode, useState, useEffect } from "react";

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Details open={isOpen} onToggle={() => setIsOpen(!isOpen)}>
      <Details.Summary>{header}</Details.Summary>
      <Details.Content>{content}</Details.Content>
    </Details>
  );
};

export { AccordionItem };
