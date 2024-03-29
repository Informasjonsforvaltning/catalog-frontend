'use client';

import { FC, useRef, useEffect, PropsWithChildren, HTMLAttributes, Children, isValidElement } from 'react';
import styles from './dropdown-menu.module.css';

import Trigger from '../trigger';
import Menu from '../menu';

export interface Props extends HTMLAttributes<HTMLElement> {
  /**
   * A flag indicating whether dropdown menu is open
   * @type {boolean}
   */
  isOpen: boolean;
  /**
   * Dropdown menu close handler
   * @callback CloseHandler
   * @type {CloseHandler}
   */
  onClose: () => void;
}

export const DropdownMenu: FC<PropsWithChildren<Props>> = ({ isOpen, onClose, children, ...props }) => {
  const dropdownMenuElement = useRef<HTMLElement | null>(null);

  const triggerChild = Children.map(children, (child) =>
    isValidElement(child) && child.type === Trigger ? child : null,
  )?.shift();
  const menuChild = Children.map(children, (child) =>
    isValidElement(child) && child.type === Menu ? child : null,
  )?.shift();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      e.stopPropagation();

      if (!dropdownMenuElement.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <nav
      className={styles.dropdownMenu}
      {...props}
      ref={dropdownMenuElement}
    >
      <div
        className={styles.trigger}
        onClick={isOpen ? onClose : undefined}
      >
        {triggerChild}
      </div>
      {isOpen && <div className={styles.menu}>{menuChild}</div>}
    </nav>
  );
};

export default DropdownMenu;
