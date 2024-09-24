import { Label, Tag } from '@digdir/designsystemet-react';
import styles from './title-with-tag.module.css';
import { ReactNode } from 'react';

interface Props {
  title: ReactNode | string;
  tagTitle: string;
  tagColor?: TagColor;
  tagSize?: TagSize;
}

type TagColor = 'first' | 'second' | 'success' | 'danger' | 'third' | 'neutral' | 'info' | 'warning';

type TagSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';

export function TitleWithTag({ title, tagTitle, tagColor = 'warning', tagSize = 'medium' }: Props) {
  return (
    <div className={styles.container}>
      {typeof title === 'string' ? <Label>{title}</Label> : title}
      <Tag
        color={tagColor}
        size={tagSize}
      >
        {tagTitle}
      </Tag>
    </div>
  );
}

export default TitleWithTag;
