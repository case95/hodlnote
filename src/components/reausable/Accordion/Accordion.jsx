import React from "react";

import "./Accordion.css";

const Accordion = ({
  title,
  children,
  id,
  thisAccordion,
  influencedAccordionId,
  influencedAccordion,
  accordionState,
  setAccordionState,
}) => {
  const openAccordion = () => {
    const content = document.getElementById(`accordion-content-${id}`);
    const influencedAccordionContent = document.getElementById(
      `accordion-content-${influencedAccordionId}`
    );
    content.classList.toggle("accordion-content-open");
    if (
      accordionState &&
      influencedAccordion &&
      influencedAccordionId &&
      setAccordionState
    ) {
      if (!accordionState[influencedAccordion]) {
        setAccordionState({
          ...accordionState,
          [thisAccordion]: !accordionState[thisAccordion],
        });
      } else {
        influencedAccordionContent.classList.toggle("accordion-content-open");
        setAccordionState({
          [thisAccordion]: !accordionState[thisAccordion],
          [influencedAccordion]: !accordionState[influencedAccordion],
        });
      }
    }
  };

  return (
    <div className="accordion">
      <div
        className="accordion-title"
        id={`accordion-title-${id}`}
        onClick={() => openAccordion(id)}
      >
        {title}{" "}
        <span className="accordion-title-arrow" id={`accordion-title-arrow`}>
          
        </span>
      </div>
      <div className="accordion-content" id={`accordion-content-${id}`}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
