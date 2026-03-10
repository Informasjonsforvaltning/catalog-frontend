"use client";

import { useRouter } from "next/navigation";
import { Pagination } from "@catalog-frontend/ui-v2";
import styles from "./activity-log-page.module.css";

type Props = {
  catalogId: string;
  totalPages: number;
  currentPage: number;
  view?: string;
};

export const ActivityLogPagination = ({
  catalogId,
  totalPages,
  currentPage,
  view,
}: Props) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page - 1));
    if (view) params.set("view", view);
    router.push(`/catalogs/${catalogId}/activity-log?${params.toString()}`);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage + 1}
        onChange={handlePageChange}
      />
    </div>
  );
};
