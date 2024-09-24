import React, { FC, PropsWithChildren, ReactElement } from 'react';
import styles from './form-container.module.css';
import cn from 'classnames';
import { Heading, Paragraph } from '@digdir/designsystemet-react';

interface Props extends PropsWithChildren {
  variant?: 'second' | 'third';
}

interface HeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'second' | 'third';
}

const FormContainer: FC<PropsWithChildren<Props>> & {
  Header: FC<HeaderProps>;
} = ({ variant, children }) => {
  return (
    <div className={`${styles.container} ${variant && styles[variant]}`}>
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

const Header: FC<HeaderProps> = ({ title, subtitle, variant }) => {
  const backgroundColor = styles[variant || 'third'];
  return (
    <div className={cn(styles.header, backgroundColor)}>
      <Heading className={styles.title}>{title}</Heading>
      <Paragraph className={styles.subtitle}>{subtitle}</Paragraph>
    </div>
  );
};

FormContainer.Header = Header;

export { FormContainer };
