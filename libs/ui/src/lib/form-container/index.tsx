import React, { FC, PropsWithChildren, ReactElement } from 'react';
import styles from './form-container.module.css';
import cn from 'classnames';
import { Heading, Paragraph } from '@digdir/designsystemet-react';

type Variant = 'default' | 'secondary';

interface Props extends PropsWithChildren {
  variant?: Variant;
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  variant?: Variant;
}

const FormContainer: FC<PropsWithChildren<Props>> & {
  Header: FC<HeaderProps>;
} = ({ variant = 'default', children }) => {
  return (
    <div className={cn(styles.container, styles[variant])}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && child.type === Header ? (
          <div className={styles.headerWrapper}>{child}</div>
        ) : (
          <div className={styles.content}>{child}</div>
        ),
      )}
    </div>
  );
};

const Header: FC<HeaderProps> = ({ title, subtitle, variant = 'default' }) => {
  return (
    <div className={cn(styles.header, styles[variant])}>
      <Heading className={styles.title}>{title}</Heading>
      <Paragraph className={styles.subtitle}>{subtitle}</Paragraph>
    </div>
  );
};

FormContainer.Header = Header;

export { FormContainer };
