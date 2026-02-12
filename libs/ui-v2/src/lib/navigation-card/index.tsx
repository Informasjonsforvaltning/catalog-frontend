"use client";

import Link from "next/link";
import styles from "./navigation-card.module.css";
import {
  Heading,
  Card as CardBase,
  Paragraph,
  Card,
} from "@digdir/designsystemet-react";
interface Card {
  title?: string;
  body?: React.ReactElement | string;
  href?: string;
  icon?: React.ReactElement;
  subtitle?: string;
}

const NavigationCard = ({ title, body, href, icon, subtitle }: Card) => {
  return (
    <CardBase
      color="third"
      isLink={Boolean(href)}
      asChild={Boolean(href)}
      className={styles.cardBase}
    >
      {href ? (
        <Link className={styles.card} href={href}>
          <div className={styles.icon}>{icon}</div>

          <Heading className={styles.heading} size="sm" level={2}>
            {title}
          </Heading>
          {subtitle && (
            <Heading size="2xs" level={3} className={styles.subtitle}>
              {subtitle}
            </Heading>
          )}
          <CardBase.Content className={styles.body}>{body}</CardBase.Content>
        </Link>
      ) : (
        <div className={styles.card}>
          <span className={styles.icon}>{icon}</span>
          <Heading className={styles.heading} size="sm">
            {title}
          </Heading>
          <Paragraph className={styles.body}>{body}</Paragraph>
        </div>
      )}
    </CardBase>
  );
};

export { NavigationCard };
