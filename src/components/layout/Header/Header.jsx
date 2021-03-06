import React, { useState } from "react";
import { Link } from "react-router-dom";

// IMporting custom components
import MyLink from "../../reausable/MyLink/MyLink";

import "./Header.css";
const Header = ({ navLinksList }) => {
  const [loggedStatus, setLoggedStatus] = useState(false);

  // Component state.
  const navLinks = navLinksList;

  const createNavLinks = (pages) => {
    return pages.map((page) => {
      const { link, name } = page;
      switch (name) {
        case "Wallets":
          if (loggedStatus === false) break;
          else
            return (
              <li className="header-nav-item" key={name}>
                <MyLink link={link} className="header-nav-item-link">
                  {name}
                </MyLink>
              </li>
            );
        case "Login":
          return (
            <li className="header-nav-item" key={name}>
              <MyLink
                link={link}
                className="header-nav-item-link"
                onClick={() => setLoggedStatus(!loggedStatus)}
              >
                {name}
              </MyLink>
            </li>
          );

        default:
          return (
            <li className="header-nav-item" key={name}>
              <MyLink link={link} className="header-nav-item-link">
                {name}
              </MyLink>
            </li>
          );
      }
      return undefined;
    });
  };

  return (
    <header className="header" id="header">
      <Link to="/">
        <div className="header-logo"></div>
      </Link>

      <nav className="header-nav">
        <ul>
          {Array.isArray(navLinksList) &&
            navLinksList.length > 0 &&
            createNavLinks(navLinks)}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
