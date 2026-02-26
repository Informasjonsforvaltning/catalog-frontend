"use client";

import Link from "next/link";
import styles from "./navigation-card.module.css";
import { Card, Heading, Paragraph } from "@digdir/designsystemet-react";
interface CardProps {
  title?: string;
  body?: React.ReactElement | string;
  href?: string;
  icon?: React.ReactElement;
  subtitle?: string;
}

const NavigationCard = ({ title, body, href, icon, subtitle }: CardProps) => {
  return (
    <Card
      data-color="accent"
      variant="tinted"
      asChild={Boolean(href)}
      className={styles.cardBase}
    >
      {href ? (
        <Link className={styles.card} href={href}>
          <div className={styles.icon}>{icon}</div>

          <Heading className={styles.heading} data-size="sm" level={2}>
            {title}
          </Heading>
          {subtitle && (
            <Heading data-size="2xs" level={3} className={styles.subtitle}>
              {subtitle}
            </Heading>
          )}
          <Paragraph className={styles.body}>{body}</Paragraph>
        </Link>
      ) : (
        <div className={styles.card}>
          <span className={styles.icon}>{icon}</span>
          <Heading className={styles.heading} data-size="sm">
            {title}
          </Heading>
          <Paragraph className={styles.body}>{body}</Paragraph>
        </div>
      )}
    </Card>
  );
};

export { NavigationCard };
