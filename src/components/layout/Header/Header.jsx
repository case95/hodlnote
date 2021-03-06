import React, { useState } from "react";
import { Link } from "react-router-dom";

// IMporting custom components
import MyLink from "../../reausable/MyLink/MyLink";

import "./Header.css";
const Header = ({ navLinksList, setNavLinksList }) => {
  const [loggedStatus, setLoggedStatus] = useState(false);

  // Component state.
  const navLinks = navLinksList;

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
                onClick={() => handleLogin(!loggedStatus)}
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

  const handleLogin = () => {
    const wallet = { name: "Wallets", link: "/Wallets" };

    const included = navLinksList.some((obj) => {
      console.log(obj);
      return obj.name === wallet.name;
    });

    if (included) {
      const filteredNavLinksList = navLinksList.filter((obj) => {
        return obj.name !== wallet.name;
      });
      console.log("FILTERED NAV: " + filteredNavLinksList);
      return setNavLinksList([...filteredNavLinksList]);
    } else {
      console.log("ADDED WALLETS");
      return setNavLinksList([
        ...navLinksList,
        { name: "Wallets", link: "/Wallets" },
      ]);
    }
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
            createNavLinks(navLinksList)}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
