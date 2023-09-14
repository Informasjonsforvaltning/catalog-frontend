import styles from './card.module.css';
import { ArrowRightIcon } from '@navikt/aksel-icons';
interface Card {
  title?: string;
  body?: string;
  href?: string;
}

export function Card({ title, body, href }: Card) {
  return (
    <a
      href={href ? href : ''}
      className={styles.card}
    >
      <div className={styles.icon}></div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.body}>{body}</p>
      <ArrowRightIcon
        className={styles.arrowIcon}
        title='arrow-right button'
      />
    </a>
  );
}

export default Card;
