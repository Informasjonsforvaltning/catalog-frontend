'use client';

import Link from 'next/link';
import styles from './navigation-card.module.css';
import { Heading, Card as CardBase, Paragraph } from '@digdir/designsystemet-react';
interface Card {
  title?: string;
  body?: string;
  href?: string;
  icon?: React.ReactElement;
}

const NavigationCard = ({ title, body, href, icon }: Card) => {
  return (
    <CardBase
      color='third'
      isLink={Boolean(href)}
      asChild={Boolean(href)}
    >
      {href ? (
        <Link
          className={styles.card}
          href={href}
        >
          <div className={styles.icon}>{icon}</div>

          <Heading
            className={styles.heading}
            size='sm'
          >
            {title}
          </Heading>
          <Paragraph className={styles.body}>{body}</Paragraph>
        </Link>
      ) : (
        <div className={styles.card}>
          <span className={styles.icon}>{icon}</span>
          <Heading
            className={styles.heading}
            size='sm'
          >
            {title}
          </Heading>
          <Paragraph className={styles.body}>{body}</Paragraph>
        </div>
      )}
    </CardBase>
  );
};

export { NavigationCard };
