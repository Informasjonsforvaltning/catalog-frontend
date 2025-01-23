import { Tag } from '@digdir/designsystemet-react';
import styles from './label.module.css';
import { HelpMarkdown } from '../help-markdown';
import { localization } from '@catalog-frontend/utils';

type Props = {
  children: string;
  tagTitle?: string;
  tagColor?: TagColor;
  tagSize?: TagSize;
  helpText?: string;
}

type TagColor = 'first' | 'second' | 'success' | 'danger' | 'third' | 'neutral' | 'info' | 'warning';

type TagSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';

export function TitleWithHelpTextAndTag({
  children: title,
  tagTitle,
  tagColor = 'warning',
  tagSize = 'sm',
  helpText
}: Props) {
  return (
    <div className={styles.container} >
      {title}      
      {helpText && <HelpMarkdown aria-label={`${localization.helpWithCompleting}`}>{helpText}</HelpMarkdown>}
      {tagTitle && (
        <Tag
          color={tagColor}
          size={tagSize}
        >
          {tagTitle}
        </Tag>
      )}      
    </div>
  );
}

export default TitleWithHelpTextAndTag;
