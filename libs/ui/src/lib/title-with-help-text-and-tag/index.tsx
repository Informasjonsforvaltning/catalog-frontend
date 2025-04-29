import { Tag } from '@digdir/designsystemet-react';
import { localization } from '@catalog-frontend/utils';
import styles from './label.module.css';
import { HelpMarkdown } from '../help-markdown';

type Props = {
  children: string;
  tagTitle?: string;
  tagColor?: TagColor;
  tagSize?: TagSize;
  helpText?: string;
  changed?: boolean;
};

type TagColor = 'first' | 'second' | 'success' | 'danger' | 'third' | 'neutral' | 'info' | 'warning';

type TagSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';

export function TitleWithHelpTextAndTag({
  children: title,
  tagTitle,
  tagColor = 'warning',
  tagSize = 'sm',
  helpText,
  changed = false,
}: Props) {
  return (
    <div className={styles.container}>
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
      {changed && (
        <Tag
          size='sm'
          color='warning'
        >{`${localization.changed}`}</Tag>
      )}
    </div>
  );
}

export default TitleWithHelpTextAndTag;
