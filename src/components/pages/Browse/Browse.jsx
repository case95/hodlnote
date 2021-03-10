import React, { useState, useEffect } from "react";

import Title from "../../reausable/Title/Title";
import BrowseByValue from "./BrowseByValue/BrowseByValue";
import BrowseByDate from "./BrowseByDate/BrowseByDate";
import Accordion from "../../reausable/Accordion/Accordion";
import Spinner from "../../reausable/Spinner/Spinner";

import exchangeratesService from "./utils/exchangeratesServices";

import "./Browse.css";

const Browse = (props) => {
  const [accordionState, setAccordionState] = useState({
    accordion1: false,
    accordion2: false,
    accordion3: false,
  });

  const [fiatCurrencies, setFiatCurrencies] = useState([]);

  // Disable wheel event in inputs
  document.addEventListener("wheel", function (event) {
    if (document.activeElement.type === "number") {
      document.activeElement.blur();
    }
  });

  useEffect(() => {
    const fetchFiatCurrencies = async () => {
      const fetchedData = await exchangeratesService();
      setFiatCurrencies([...fetchedData]);
    };

    fetchFiatCurrencies();
  }, []);

  if (!(Array.isArray(fiatCurrencies) && fiatCurrencies.length > 0)) {
    return (
      <div className="browse">
        <div className="browse-loading">
          <Spinner />
        </div>
      </div>
    );
  } else {
    console.log(
      "%cFIAT CURRENCIES: ",
      "background: #292; color: #000",
      fiatCurrencies
    );
    return (
      <div className="browse">
        <Accordion
          title={<Title>Browse by value</Title>}
          id={"1"}
          accordionState={accordionState}
          setAccordionState={setAccordionState}
          influencedAccordion={"accordion2"}
          influencedAccordionId={"2"}
          thisAccordion={"accordion1"}
        >
          <BrowseByValue
            history={props.history}
            fiatCurrencies={fiatCurrencies}
          ></BrowseByValue>
        </Accordion>
        <hr />
        <Accordion
          title={<Title>Browse by Date</Title>}
          id={"2"}
          accordionState={accordionState}
          setAccordionState={setAccordionState}
          influencedAccordion={"accordion1"}
          influencedAccordionId={"1"}
          thisAccordion={"accordion2"}
        >
          <BrowseByDate
            history={props.history}
            fiatCurrencies={fiatCurrencies}
          ></BrowseByDate>
        </Accordion>
      </div>
    );
  }
};

export default Browse;
