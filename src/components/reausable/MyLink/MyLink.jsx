import React from "react";
import { Link } from "react-router-dom";

// Importing style
import "./MyLink.css";

const MyLink = ({ link, className, children }) => {
  return (
    <Link to={link} className={`my-link ${className}`}>
      {children}
    </Link>
  );
};

export default MyLink;
