import React, { FC, PropsWithChildren } from 'react';

export const Menu: FC<PropsWithChildren> = ({ children }) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>{children}</>
);

export default Menu;
