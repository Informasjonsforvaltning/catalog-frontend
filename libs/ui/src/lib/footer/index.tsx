import { FC } from "react";
import Link from "../link";

import styles from "./footer.module.css";
import { localization } from "@catalog-frontend/utils";
import EmailIcon from "./images/email.svg";
import Illustration from "./images/illustration.svg";

export interface FooterProps {
  /**
   * font color
   * @type {string}
   */
  fontColor?: string;
  /**
   * background color
   * @type {string}
   */
  backgroundColor?: string;
}

export const Footer: FC<FooterProps> = ({ fontColor, backgroundColor }) => (
  <footer
    className={styles.footer}
    style={{
      ...(fontColor ? { color: fontColor } : {}),
      ...(backgroundColor ? { background: backgroundColor } : {}),
    }}
  >
    <Illustration className={styles.illustration} />
    <div className={styles.content}>
      <div className={styles.column}>
        {localization.footer.digdirManagesNationalDataCatalog}
      </div>
      <div className={styles.column}>
        <Link href="https://data.norge.no/publishing/terms-of-use">
          {localization.footer.termsOfUse}{" "}
        </Link>
        <Link
          href="https://www.digdir.no/om-oss/personvernerklaering/706"
          external={true}
        >
          {localization.footer.privacyStatement}
        </Link>
        <Link
          href="https://www.digdir.no/om-oss/informasjonskapsler/707"
          external={true}
        >
          {localization.footer.cookies}
        </Link>
        <Link
          href="https://uustatus.no/nb/erklaringer/publisert/8020b962-b706-4cdf-ab8b-cdb5f480a696"
          external={true}
        >
          {localization.footer.accessibility}
        </Link>
      </div>
      <div className={styles.column}>
        <Link href="mailto:fellesdatakatalog@digdir.no" icon={<EmailIcon />}>
          fellesdatakatalog@digdir.no
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
