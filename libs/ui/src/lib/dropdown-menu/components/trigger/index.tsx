import { FC, PropsWithChildren } from 'react';

export const Trigger: FC<PropsWithChildren> = ({ children }) => (
  // eslint-disable-next-line react/jsx-no-useless-fragment
  <>{children}</>
);

export default Trigger;
