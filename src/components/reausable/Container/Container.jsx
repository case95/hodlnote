import React from "react";

import "./Container.css";

const Container = ({ color, className, children }) => {
  return (
    <div className={`container container-${color || "blue"} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
