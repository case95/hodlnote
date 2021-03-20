import React from "react";

// IMporting custom components
import MyLink from "../../reusable/MyLink/MyLink";
import Switch from "../../reusable/Switch/Switch";

import "./Footer.css";

const Footer = ({ navLinksList, onLogin, checkState, onCheck }) => {
  // Returns all the nav links in the Link component layout.

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
          onCheck={() => onCheck()}
          checkState={checkState}
          label={`switch to ${checkState ? `light` : `dark`} mode`}
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
