"use client";

import {
  Pagination as DSPagination,
  usePagination,
} from "@digdir/designsystemet-react";
import cn from "classnames";
import styles from "./pagination.module.css";

interface Props {
  onChange(selectedItem: number): void;
  totalPages: number;
  currentPage: number;
  className?: string;
}

const Pagination = ({
  onChange,
  totalPages,
  currentPage,
  className,
}: Props) => {
  const { pages, nextButtonProps, prevButtonProps } = usePagination({
    totalPages,
    currentPage,
    setCurrentPage: onChange,
  });

  return (
    <DSPagination
      className={cn(className, styles.paginationContainer)}
      data-size="sm"
    >
      <DSPagination.List>
        <DSPagination.Item>
          <DSPagination.Button aria-label="Forrige side" {...prevButtonProps}>
            Forrige
          </DSPagination.Button>
        </DSPagination.Item>
        {pages.map(({ page, itemKey, buttonProps }) => (
          <DSPagination.Item key={itemKey}>
            {typeof page === "number" && (
              <DSPagination.Button aria-label={`Side ${page}`} {...buttonProps}>
                {page}
              </DSPagination.Button>
            )}
          </DSPagination.Item>
        ))}
        <DSPagination.Item>
          <DSPagination.Button aria-label="Neste side" {...nextButtonProps}>
            Neste
          </DSPagination.Button>
        </DSPagination.Item>
      </DSPagination.List>
    </DSPagination>
  );
};

export { Pagination };
