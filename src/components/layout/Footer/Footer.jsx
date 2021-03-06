import React from "react";

// IMporting custom components
import MyLink from "../../reausable/MyLink/MyLink";

import "./Footer.css";

const Footer = ({ navLinksList }) => {
  // Component state.
  const navLinks = navLinksList;

  // Returns all the nav links in the Link component layout.
  const createNavLinks = (pages) => {
    return pages.map((page) => {
      const { link, name } = page;
      switch (name) {
        // We don't want
        default:
          return (
            <li className="footer-nav-item" key={name}>
              <MyLink link={link} className="footer-nav-item-link">
                {name}
              </MyLink>
            </li>
          );
      }
      return undefined;
    });
  };
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <ul>
          {Array.isArray(navLinksList) &&
            navLinksList.length > 0 &&
            createNavLinks(navLinks)}
        </ul>
        <a href="#header" className="scroll-to-top">
          Back <br></br> to Top
        </a>
      </nav>

      <hr></hr>
      <p className="footer-copyright">Developed by xxxxxx</p>
    </footer>
  );
};

export default Footer;
