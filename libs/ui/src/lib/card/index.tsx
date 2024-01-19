'use client';

import { Link } from '../proxy-provider';
import styles from './card.module.css';
import { ArrowRightIcon } from '@navikt/aksel-icons';
interface Card {
  title?: string;
  body?: string;
  href?: string;
  icon?: React.ReactElement;
}

const Card = ({ title, body, href, icon }: Card) => {
  return (
    <Link
      href={href ? href : ''}
      className={styles.card}
    >
      <div className={styles.icon}>{icon}</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
      <ArrowRightIcon
        className={styles.arrowIcon}
        title='arrow-right button'
      />
    </Link>
  );
};

export { Card };
