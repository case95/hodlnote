import React from "react";

// Importing PropTypes
import PropTypes from "prop-types";

import "./Container.css";

const Container = ({ color, className, children }) => {
  return (
    <div className={`container container-${color || "blue"} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
