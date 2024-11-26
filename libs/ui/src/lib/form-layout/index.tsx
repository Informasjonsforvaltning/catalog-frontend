'use client';

import React, { Children, PropsWithChildren, ReactNode, useRef, useState } from 'react';
import styles from './form-layout.module.scss';
import { Heading, Link, Paragraph } from '@digdir/designsystemet-react';
import { useIntersectionObserver } from '../intersection-observer';
import classNames from 'classnames';

type FormLayoutProps = {
  title?: ReactNode;
  children: ReactNode;
};

type SideMenuProps = {
  heading?: string;
} & PropsWithChildren;

type SectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  required?: boolean;
} & PropsWithChildren;

const SideMenu = ({ heading, children }: SideMenuProps) => {
  return (
    <div>
      <Heading
        size='sm'
        className={styles.sideMenuHeading}
      >
        {heading}
      </Heading>
      <ol>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === MenuItem) {
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return <>{child}</>;
          }
        })}
      </ol>
    </div>
  );
};

const MenuItem = ({ active, required = false, children }: PropsWithChildren & { active: boolean; required?: boolean }) => {
  return <li className={classNames(active ? styles.active : {}, required ? styles.required : {})}>{children}</li>;
};

export const FormLayout = ({ children }: FormLayoutProps) => {
  const childrenArray = Children.toArray(children);

  const [activeSection, setActiveSection] = useState('');
  const sectionRefs = useRef(
    childrenArray
      .filter((child) => React.isValidElement(child) && child.type === Section)
      .map(() => React.createRef<HTMLDivElement>()),
  );
  const [observerEnabled, setObserverEnabled] = useState(true);

  useIntersectionObserver({
    activeSection,
    setActiveSection,
    sectionRefs: sectionRefs.current,
    observerEnabled,
    threshold: 0.8,
  });

  const handleNavClick = (section: string, index: number) => {
    setActiveSection(section); // Manually set the active section
    setObserverEnabled(false); // Disable observer temporarily

    // Scroll to the clicked section smoothly
    sectionRefs.current[index].current?.scrollIntoView({ behavior: 'smooth' });

    // Re-enable observer after a delay to avoid conflict
    setTimeout(() => {
      setObserverEnabled(true);
    }, 1000);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.grid}>
        <div
          className={styles.sideMenu}
          style={{ height: `${((childrenArray.length) * 2.4479) + 2.95}rem` }}
        >
          <SideMenu heading='Innhold i skjema'>
            {childrenArray.map((child, index) => {
              if (React.isValidElement(child) && child.type === Section) {
                const { id, title, required } = child.props as SectionProps;
                return (
                  <MenuItem
                    key={`menu-item-${id}`}
                    active={activeSection === id}
                    required={required}
                  >
                    <Link onClick={() => handleNavClick(id, index)}>{title} {required && (<span className={styles.required}>(Må fylles ut)</span>)}</Link>
                  </MenuItem>
                );
              } else {
                return null;
              }
            })}
          </SideMenu>
        </div>
        <div className={styles.content}>
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child) && child.type === Section) {
              const { id } = child.props as SectionProps;
              return (
                <div
                  id={id}
                  key={id}
                  ref={sectionRefs.current[index]}
                >
                  {child}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

const Section = ({ id, title, subtitle, children }: SectionProps) => (
  <div className={styles.section}>
    <div className={styles.sectionHeading}>
      <Heading
        className={styles.sectionHeadingTitle}
        level={2}
      >
        {title}
      </Heading>
      <Paragraph className={styles.sectionHeadingSubtitle}>{subtitle}</Paragraph>
    </div>
    <div className={styles.sectionContent}>{children}</div>
  </div>
);

FormLayout.Section = Section;

export default FormLayout;
