import React from "react";
import { Link } from "react-router-dom";

// Importing style
import "./MyLink.css";

const MyLink = ({ link, className, children, onClick }) => {
  return (
    <Link to={link} className={`my-link ${className}`} onClick={onClick}>
      {children}
    </Link>
  );
};

export default MyLink;
