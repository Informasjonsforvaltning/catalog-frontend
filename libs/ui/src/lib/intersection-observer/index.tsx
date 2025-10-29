'use client';

/**
 * Custom hook to observe the intersection of multiple sections and set the active section.
 *
 * @param setActiveSection - A function to update the active section state.
 * @param sectionRefs - An array of references to the sections to be observed.
 * @param observerEnabled - A boolean to enable or disable the observer.
 * @param threshold - A number representing the intersection threshold.
 *
 * @returns void
 *
 * @example
 * ```typescript
 * const sectionRefs = [useRef<HTMLElement>(null), useRef<HTMLElement>(null)];
 * const [activeSection, setActiveSection] = useState<string>('');
 *
 * useIntersectionObserver({
 *   activeSection,
 *   setActiveSection,
 *   sectionRefs,
 *   threshold: 0.5
 * });
 * ```
 */
import { Dispatch, RefObject, SetStateAction, useEffect } from 'react';

type useIntersectionObserverProps = {
  activeSection: string;
  setActiveSection: Dispatch<SetStateAction<string>>;
  sectionRefs: RefObject<HTMLElement>[];
  threshold?: number;
  observerEnabled?: boolean;
};

export const useIntersectionObserver = ({
  activeSection,
  setActiveSection,
  sectionRefs,
  threshold = 0.6,
  observerEnabled = true,
}: useIntersectionObserverProps) => {
  useEffect(() => {
    if (!observerEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let activeSectionIntersecting = false;
        let sectionToActive = null;
        entries.forEach((entry) => {
          if (entry.isIntersecting && activeSection === entry.target.id) {
            activeSectionIntersecting = true;
          } else if (entry.isIntersecting) {
            sectionToActive = entry.target.id;
          }
        });

        if (!activeSectionIntersecting && sectionToActive) {
          setActiveSection(sectionToActive);
        }
      },
      { threshold },
    );

    sectionRefs.forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      sectionRefs.forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
    };
  }, [sectionRefs, activeSection, setActiveSection, threshold, observerEnabled]);
};
