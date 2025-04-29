import React, { FC, PropsWithChildren, ReactElement } from 'react';
import styles from './form-container.module.css';
import cn from 'classnames';
import { Heading, Paragraph } from '@digdir/designsystemet-react';

type Variant = 'default' | 'secondary';

interface Props extends PropsWithChildren {
  variant?: Variant;
  className?: string;
}

interface HeaderProps {
  id: string;
  title: string;
  subtitle?: string;
  variant?: Variant;
}

const FormContainer: FC<PropsWithChildren<Props>> & {
  Header: FC<HeaderProps>;
} = ({ variant = 'default', className, children }) => {
  return (
    <div className={cn(styles.container, styles[variant], className)}>
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

const Header: FC<HeaderProps> = ({ id, title, subtitle, variant = 'default' }) => {
  return (
    <div
      id={id}
      className={cn(styles.header, styles[variant])}
    >
      <Heading className={styles.title}>{title}</Heading>
      <Paragraph className={styles.subtitle}>{subtitle}</Paragraph>
    </div>
  );
};

FormContainer.Header = Header;

export { FormContainer };
