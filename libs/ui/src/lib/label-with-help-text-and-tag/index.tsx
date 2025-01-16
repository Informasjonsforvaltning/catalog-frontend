import { Label, Tag } from '@digdir/designsystemet-react';
import styles from './label.module.css';
import { PropsWithChildren, ReactNode } from 'react';
import { HelpMarkdown } from '../help-markdown';

type Props = {
  fieldId?: string; // Id to connect the label to the field. WCAG.
  tagTitle?: string;
  tagColor?: TagColor;
  tagSize?: TagSize;
  helpText?: string;
  helpAriaLabel?: string;
} & PropsWithChildren;

type TagColor = 'first' | 'second' | 'success' | 'danger' | 'third' | 'neutral' | 'info' | 'warning';

type TagSize = 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large';

type variant = 'recommended' | 'required';

export function LabelWithHelpTextAndTag({
  children,
  tagTitle,
  tagColor = 'warning',
  tagSize = 'sm',
  helpAriaLabel,
  helpText,
  fieldId,
}: Props) {
  return (
    <div className={styles.container}>
      {typeof children === 'string' ? (
        <Label
          htmlFor={fieldId}
          size='sm'
        >
          {children}
        </Label>
      ) : (
        children
      )}

      {helpText && helpAriaLabel && <HelpMarkdown aria-label={helpAriaLabel}>{helpText}</HelpMarkdown>}
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

export default LabelWithHelpTextAndTag;
