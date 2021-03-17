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
      const fetchedData = await exchangeratesService("USD");
      setFiatCurrencies([...fetchedData]);
    };

    fetchFiatCurrencies();
  }, []);

  const openAccordion = (e) => {
    const accordionOpenStatus = { ...accordionState };
    Object.keys(accordionOpenStatus).forEach(function (key) {
      accordionOpenStatus[key] = false;
    });

    setAccordionState({
      ...accordionOpenStatus,
      [e.currentTarget.getAttribute("name")]: !accordionState[
        e.currentTarget.getAttribute("name")
      ],
    });
  };

  if (!(Array.isArray(fiatCurrencies) && fiatCurrencies.length > 0)) {
    return (
      <div className="browse">
        <div className="browse-loading">
          <Spinner />
        </div>
      </div>
    );
  } else {
    return (
      <div className="browse">
        <Accordion
          title={<Title>Browse by value</Title>}
          id={"1"}
          name="accordion1"
          onClick={(e) => openAccordion(e)}
          accordionOpenState={accordionState.accordion1}
        >
          <BrowseByValue
            history={props.history}
            fiatCurrencies={fiatCurrencies}
            walletsList={props.walletsList}
            setWalletList={props.setWalletList}
          ></BrowseByValue>
        </Accordion>
        <hr />
        <Accordion
          title={<Title>Browse by Date</Title>}
          id={"2"}
          name="accordion2"
          onClick={(e) => openAccordion(e)}
          accordionOpenState={accordionState.accordion2}
        >
          <BrowseByDate
            history={props.history}
            fiatCurrencies={fiatCurrencies}
            walletsList={props.walletsList}
            setWalletList={props.setWalletList}
          ></BrowseByDate>
        </Accordion>
      </div>
    );
  }
};

export default Browse;
