import React, { FC, PropsWithChildren } from 'react';

export const CenterContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className='container grow center'>{children}</div>;
};

export default CenterContainer;
