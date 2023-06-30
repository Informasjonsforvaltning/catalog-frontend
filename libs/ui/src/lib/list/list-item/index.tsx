import { ListItem as DigdirListItem, ListItemProps } from '@digdir/design-system-react';

const ListItem = ({ children, ...props }: ListItemProps) => {
  return <DigdirListItem {...props}>{children}</DigdirListItem>;
};

export { ListItem };
