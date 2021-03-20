import React from "react";

import "./Accordion.css";

const Accordion = ({
  title,
  children,
  id,
  onClick,
  name,
  accordionOpenState,
  className,
  ...otherProps
}) => {
  return (
    <div className={`accordion ${className}`}>
      <div
        className="accordion-title"
        id={`accordion-title-${id}`}
        onClick={(e) => onClick(e)}
        name={name}
      >
        {title}{" "}
        <span className="accordion-title-arrow" id={`accordion-title-arrow`}>
          
        </span>
      </div>
      <div
        className={`accordion-content ${
          accordionOpenState ? "accordion-content-open" : ""
        }`}
        id={`accordion-content-${id}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
