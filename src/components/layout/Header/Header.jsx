import React, { useState } from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";

// IMporting custom components
import MyLink from "../../reusable/MyLink/MyLink";

import "./Header.css";

const Header = ({ navLinksList, onLogin }) => {
  const [displayMenu, setDisplayMenu] = useState(false);

  const createNavLinks = (pages) => {
    return pages.map((page) => {
      const { link, name } = page;
      switch (name) {
        case "Login":
          return (
            <li className="header-nav-item" key={name}>
              <MyLink
                link={link}
                className="header-nav-item-link"
                onClick={() => onLogin()}
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
    });
  };

  return (
    <Fragment>
      <header className="header" id="header">
        <Link to="/">
          <div className="header-logo"></div>
        </Link>
        <div
          className="header-hamburger-icon"
          onClick={() => setDisplayMenu(!displayMenu)}
        >
          <div className="header-hamburger-icon-line"></div>
          <div className="header-hamburger-icon-line"></div>
          <div className="header-hamburger-icon-line"></div>
        </div>
        <nav className="header-nav">
          <ul>
            {Array.isArray(navLinksList) &&
              navLinksList.length > 0 &&
              createNavLinks(navLinksList)}
          </ul>
        </nav>
      </header>
      <nav className={`header-hamburger-nav ${displayMenu ? "" : "closed"}`}>
        <ul>
          {Array.isArray(navLinksList) &&
            navLinksList.length > 0 &&
            createNavLinks(navLinksList)}
        </ul>
      </nav>
    </Fragment>
  );
};

export default Header;
