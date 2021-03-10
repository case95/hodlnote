import React from "react";

import spinner from "../../../sourceFiles/spinner.gif";

const Spinner = () => {
  return (
    <div className="spinner">
      <img src={spinner} alt="spinner" />
    </div>
  );
};

export default Spinner;
