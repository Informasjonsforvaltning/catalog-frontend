'use client';

import React, { Children, PropsWithChildren, ReactNode, useRef, useState } from 'react';
import styles from './form-layout.module.scss';
import { Alert, Heading, Link, Paragraph } from '@digdir/designsystemet-react';
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

type OptionsProps = PropsWithChildren;

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

const MenuItem = ({
  active,
  required = false,
  children,
}: PropsWithChildren & { active: boolean; required?: boolean }) => {
  return <li className={classNames(active ? styles.active : {}, required ? styles.required : {})}>{children}</li>;
};

export const FormLayout = ({ children }: FormLayoutProps) => {
  const childrenArray = Children.toArray(children);
  const sectionArray = childrenArray
    .filter((child) => React.isValidElement(child) && child.type === Section)
    .map((child) => child as React.ReactElement);

  const [activeSection, setActiveSection] = useState('');
  const sectionRefs = useRef(sectionArray.map(() => React.createRef<HTMLDivElement>()));

  const [observerEnabled, setObserverEnabled] = useState(true);
  const options = childrenArray.filter((child) => React.isValidElement(child) && child.type === Options)[0];

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
          style={{ height: `${childrenArray.length * 2.4479 + 2.95}rem` }}
        >
          <SideMenu heading='Innhold i skjema'>
            {sectionArray.map((child, index) => {
              const { id, title, required } = child.props as SectionProps;
              return (
                <MenuItem
                  key={`menu-item-${id}`}
                  active={activeSection === id}
                  required={required}
                >
                  <Link onClick={() => handleNavClick(id, index)}>
                    {title} {required && <span className={styles.required}>(Må fylles ut)</span>}
                  </Link>
                </MenuItem>
              );
            })}
          </SideMenu>
        </div>
        <div className={styles.content}>
          {options && <div>{options}</div>}
          {sectionArray.map((section, index) => {
            const { id } = section.props as SectionProps;
            const ref = sectionRefs.current[index];
            return (
              <div
                id={id}
                key={id}
                ref={ref}
              >
                {section}
              </div>
            );
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

const Options = ({ children }: OptionsProps) => <Alert>{children}</Alert>;

FormLayout.Section = Section;
FormLayout.Options = Options;

export default FormLayout;
