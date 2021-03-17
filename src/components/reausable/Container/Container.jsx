import React from "react";

import "./Container.css";

const Container = ({ color, className, children }) => {
  return (
    <div className={`container container-${color || "blue"} ${className}`}>
      <div className="container-content">{children}</div>
    </div>
  );
};

export default Container;
