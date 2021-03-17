import React, { useState } from "react";

// IMporting custom components
import MyLink from "../../reausable/MyLink/MyLink";
import Switch from "../../reausable/Switch/Switch";

import "./Footer.css";

const Footer = ({ navLinksList, onLogin }) => {
  // Returns all the nav links in the Link component layout.

  const [checked, setChecked] = useState(false);

  const onDarkMode = () => {
    if (!checked) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }

    setChecked(!checked);
  };

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
    <footer className="footer">
      <nav className="footer-nav">
        <ul>
          {Array.isArray(navLinksList) &&
            navLinksList.length > 0 &&
            createNavLinks(navLinksList)}
        </ul>
        <a href="#header" className="scroll-to-top">
          Back <br></br> to Top
        </a>
      </nav>
      <div className="footer-switch">
        <Switch
          onCheck={() => onDarkMode()}
          checkedState={checked}
          label={`switch to ${checked ? `light` : `dark`} mode`}
        ></Switch>
        <a href="#header" className="scroll-to-top">
          Back <br></br> to Top
        </a>
      </div>

      <hr></hr>
      <p className="footer-copyright">Developed by Lorenzo Del Rosario</p>
    </footer>
  );
};

export default Footer;
