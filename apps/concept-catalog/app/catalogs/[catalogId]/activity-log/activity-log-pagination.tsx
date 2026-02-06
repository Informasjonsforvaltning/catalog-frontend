"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@catalog-frontend/ui";
import styles from "./activity-log-page.module.css";

type Props = {
  catalogId: string;
  totalPages: number;
  currentPage: number;
};

export const ActivityLogPagination = ({
  catalogId,
  totalPages,
  currentPage,
}: Props) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`/catalogs/${catalogId}/activity-log?page=${page}`);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
};
