import React from "react";

import "./Button.css";

const Button = ({ children, onClick, type, link, className }) => {
  return (
    <button type={type} onClick={onClick} className={`button ${className}`}>
      <span className={type === "link" ? "button-link" : ""}>{children}</span>
    </button>
  );
};

export default Button;
