"use client";

import React, {
  Children,
  PropsWithChildren,
  ReactNode,
  useRef,
  useState,
} from "react";
import styles from "./form-layout.module.scss";
import { Heading, Link, Paragraph, Tag } from "@digdir/designsystemet-react";
import { useIntersectionObserver } from "../intersection-observer";
import classNames from "classnames";
import { localization } from "@catalog-frontend/utils";

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
  changed?: boolean;
  error?: boolean;
} & PropsWithChildren;

const SideMenu = ({ heading, children }: SideMenuProps) => {
  return (
    <div>
      <Heading size="sm" className={styles.sideMenuHeading}>
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
      <div className={styles.sideMenuFooter}>* Påkrevd</div>
    </div>
  );
};

const MenuItem = ({
  active,
  required = false,
  children,
}: PropsWithChildren & { active: boolean; required?: boolean }) => {
  return (
    <li
      className={classNames(
        active ? styles.active : {},
        required ? styles.required : {},
      )}
    >
      {children}
    </li>
  );
};

export const FormLayout = ({ children }: FormLayoutProps) => {
  const childrenArray = Children.toArray(children);
  const sectionArray = childrenArray
    .filter((child) => React.isValidElement(child) && child.type === Section)
    .map((child) => child as React.ReactElement);

  const [activeSection, setActiveSection] = useState("");
  const sectionRefs = useRef(
    sectionArray.map(() => React.createRef<HTMLDivElement>()),
  );

  const [observerEnabled, setObserverEnabled] = useState(true);

  useIntersectionObserver({
    activeSection,
    setActiveSection,
    sectionRefs: sectionRefs.current as React.RefObject<HTMLElement>[],
    observerEnabled,
    threshold: 0.8,
  });

  const handleNavClick = (section: string, index: number) => {
    setActiveSection(section); // Manually set the active section
    setObserverEnabled(false); // Disable observer temporarily

    // Scroll to the clicked section smoothly
    sectionRefs.current[index].current?.scrollIntoView({ behavior: "smooth" });

    // Re-enable observer after a delay to avoid conflict
    setTimeout(() => {
      setObserverEnabled(true);
    }, 1000);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.grid}>
        <div className={styles.sideMenu}>
          <SideMenu heading="Innhold i skjema">
            {sectionArray.map((child, index) => {
              const { id, title, required, changed, error } =
                child.props as SectionProps;
              return (
                <MenuItem
                  key={`menu-item-${id}`}
                  active={activeSection === id}
                  required={required}
                >
                  <Link
                    onClick={() => handleNavClick(id, index)}
                    className={styles.sideMenuItem}
                  >
                    <span>
                      {title}{" "}
                      {required && (
                        <span
                          className={styles.required}
                          aria-label={
                            localization.conceptForm.validation.required
                          }
                        >
                          *
                        </span>
                      )}
                    </span>
                    {changed && (
                      <Tag
                        size="sm"
                        color="warning"
                        style={{ scale: 0.8, margin: "-0.25rem 0" }}
                      >
                        {localization.changed}
                      </Tag>
                    )}
                    {error && (
                      <Tag
                        size="sm"
                        color="danger"
                        style={{ scale: 0.8, margin: "-0.25rem 0" }}
                      >
                        {localization.error}
                      </Tag>
                    )}
                  </Link>
                </MenuItem>
              );
            })}
          </SideMenu>
        </div>
        <div className={styles.content}>
          {sectionArray.map((section, index) => {
            const { id } = section.props as SectionProps;
            const ref = sectionRefs.current[index];
            return (
              <div id={id} key={id} ref={ref}>
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
      <Heading className={styles.sectionHeadingTitle} level={2}>
        {title}
      </Heading>
      <Paragraph className={styles.sectionHeadingSubtitle}>
        {subtitle}
      </Paragraph>
    </div>
    <div className={styles.sectionContent}>{children}</div>
  </div>
);

FormLayout.Section = Section;

export default FormLayout;
