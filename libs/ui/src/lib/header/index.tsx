import React, { FC, useState } from "react";
import { localization } from "@catalog-frontend/utils";
import Icon from "../icon";
import UserIcon from "./images/user-icon.svg";
import { Menu, Trigger } from "../dropdown-menu";
import SC from "./styled";

export interface Props {
  /**
   * Url on logo
   * @type {string}
   */
  homeUrl?: string;
  /**
   * Use demo logo
   * @type {boolean}
   * @default {false}
   */
  useDemoLogo?: boolean;
  /**
   * Username to display in header
   * @type {string}
   */
  username?: string;
  /**
   * Logout function
   * @type {() => void;}
   */
  onLogout?: () => void;
}

export const Header: FC<Props> = ({
  homeUrl,
  useDemoLogo,
  username,
  onLogout,
}) => {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);

  const openDropdownMenu = () => setIsDropdownMenuOpen(true);
  const closeDropdownMenu = () => setIsDropdownMenuOpen(false);

  return (
    <SC.Header>
      <SC.Container>
        <a href={homeUrl} aria-label="Gå til hovedsiden">
          {useDemoLogo ? <SC.LogoDemo /> : <SC.Logo />}
        </a>
        <SC.MenuItems>
          <SC.MenuItem>
            <a href="https://fellesdatakatalog.digdir.no/guidance">
              {localization.header.registerData}
            </a>
          </SC.MenuItem>
          <SC.MenuItem>
            <a href="https://admin.fellesdatakatalog.digdir.no">
              {localization.header.harvestData}
            </a>
          </SC.MenuItem>
          <SC.MenuItem>
            <a href="https://datalandsbyen.norge.no">
              {localization.header.dataCommunity}
            </a>
          </SC.MenuItem>
          <SC.MenuItem>
            <a href="https://data.norge.no">
              {localization.header.nationalDataCatalog}
            </a>
          </SC.MenuItem>
        </SC.MenuItems>
        {username && (
          <SC.DropdownMenu
            isOpen={isDropdownMenuOpen}
            onClose={closeDropdownMenu}
          >
            <Trigger>
              <SC.MenuButton onClick={openDropdownMenu}>
                <SC.MenuButtonContent>
                  <UserIcon />
                  <SC.MenuButtonContentSpan>
                    {username}
                  </SC.MenuButtonContentSpan>
                  <SC.ExpandIconWrapper>
                    <Icon name="chevronDownStroke" />
                  </SC.ExpandIconWrapper>
                </SC.MenuButtonContent>
              </SC.MenuButton>
            </Trigger>
            {onLogout && (
              <Menu>
                <SC.Menu>
                  <li>
                    <SC.MenuButton onClick={onLogout}>
                      <span>{localization.header.logout}</span>
                    </SC.MenuButton>
                  </li>
                </SC.Menu>
              </Menu>
            )}
          </SC.DropdownMenu>
        )}
      </SC.Container>
    </SC.Header>
  );
};

export default Header;
