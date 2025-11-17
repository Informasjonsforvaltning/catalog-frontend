import { Tag as DSTag, type TagProps as DSTagProps } from '@digdir/designsystemet-react';
import { forwardRef } from 'react';
import { localization } from '@catalog-frontend/utils';

export type PublishedTagProps = {
  published: boolean;
} & DSTagProps;

export const PublishedTag = forwardRef<HTMLSpanElement, PublishedTagProps>(
  ({ published, ...rest }: PublishedTagProps, ref) => {
    return (
      <DSTag
        ref={ref}
        data-color={published ? 'success' : 'warning'}
        {...rest}
      >
        {
            published ?
            `✓ ${localization.publicationState.publishedInFDK}` :
            localization.publicationState.unpublished
        }
      </DSTag>
    );
  },
);

PublishedTag.displayName = 'PublishedTag';

