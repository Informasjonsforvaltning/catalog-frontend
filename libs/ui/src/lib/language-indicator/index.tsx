import { FC } from "react";
import styles from "./language-indicator.module.css";
import { ISOLanguage } from "@catalog-frontend/types";
import { localization } from "@catalog-frontend/utils";

interface Props {
  language: ISOLanguage;
}

export const LanguageIndicator: FC<Props> = ({ language }) => {
  return language ? (
    <div className={styles.container}>
      <span
        className={styles.label}
        title={localization.language.language || ""}
      >
        {language}
      </span>
    </div>
  ) : null;
};
