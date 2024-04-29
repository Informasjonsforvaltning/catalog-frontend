'use client';

import { ListItem as DigdirListItem, ListItemProps } from '@digdir/designsystemet-react';

const ListItem = ({ children, ...props }: ListItemProps) => {
  return <DigdirListItem {...props}>{children}</DigdirListItem>;
};

export { ListItem };
