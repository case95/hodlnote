import React, { useState, useEffect } from "react";

import "./Header.css";
//@ts-ignore
const Header = (props) => {
  // @ts-ignore
  const loggedIn = false;

  const navLinksList: Array<Object> = [
    { name: "Browse", link: "/browse" },
    { name: "Login", link: "/login" },
    { name: "Register", link: "/register" },
    { name: "Wallets", link: "/Wallets" },
  ];

  // Component state.
  const [navLinks, setnavLinks] = useState(navLinksList);

  const createNavLinks = (pages: Array<object>) => {
    return pages.map((page: Object) => {
      // @ts-ignore
      const { link, name } = page;
      if (name !== "Wallets") {
        return (
          <li className="header-nav-item">
            <a href={link} className="header-nav-item-link">
              {name}
            </a>
          </li>
        );
      }

      // @ts-ignore
      if (name === "Wallets" && loggedIn === true) {
        return (
          <li className="header-nav-item">
            <a href={link} className="header-nav-item-link">
              {name}
            </a>
          </li>
        );
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
