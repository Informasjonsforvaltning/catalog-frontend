import {
  localization,
  getTranslateText as translate,
} from '@catalog-frontend/utils';
import styles from './card.module.css';
import {Concept} from '@catalog-frontend/types';
import Link from 'next/link';
import {ArrowRightIcon} from '@navikt/aksel-icons';
interface Card {
  title?: string;
  body?: string;
}

export function Card({title, body}: Card) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}></div>
      <p>Skal byttes ut med komponent fra designsystemet</p>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
      <Link href={'/manage'}>
        <ArrowRightIcon
          className={styles.arrowIcon}
          title='arrow-right button'
        />
      </Link>
    </div>
  );
}

export default Card;
