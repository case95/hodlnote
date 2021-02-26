import React, { useState, useEffect } from "react";

// IMporting custom components
import MyLink from "../../reausable/MyLink/MyLink";

import "./Header.css";
const Header = (props) => {
  const [loggedStatus, setLoggedStatus] = useState(false);

  const logInAndOut = (status) => {
    return setLoggedStatus(!status);
  };

  const navLinksList = [
    { name: "Browse", link: "/browse" },
    { name: "Login", link: "/login" },
    { name: "Register", link: "/register" },
    { name: "Wallets", link: "/Wallets" },
  ];

  // Component state.
  const [navLinks, setnavLinks] = useState(navLinksList);

  const createNavLinks = (pages) => {
    return pages.map((page, index) => {
      const { link, name } = page;
      switch (name) {
        case "Wallets":
          if (loggedStatus === false) break;
          else
            return (
              <li className="header-nav-item" key={index}>
                <MyLink link={link} className="header-nav-item-link">
                  {name}
                </MyLink>
              </li>
            );
        case "Login":
          return (
            <li className="header-nav-item" key={index}>
              <MyLink
                link={link}
                className="header-nav-item-link"
                onClick={(loggedStatus) => setLoggedStatus(!loggedStatus)}
              >
                {name}
              </MyLink>
            </li>
          );

        default:
          return (
            <li className="header-nav-item" key={index}>
              <MyLink link={link} className="header-nav-item-link">
                {name}
              </MyLink>
            </li>
          );
          break;
      }
    });
  };

  return (
    <header className="header">
      <div className="header-logo"></div>
      <nav className="header-nav">
        <ul>{createNavLinks(navLinks)}</ul>
      </nav>
    </header>
  );
};

export default Header;
