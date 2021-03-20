import React, { useState, useEffect } from "react";

import "./Switch.css";

const Switch = ({ onCheck, checkState, id, label }) => {
  return (
    <div className="switch-container">
      <label htmlFor={id} className="switch-label">
        {label}
      </label>
      <label className="switch">
        <input
          type="checkbox"
          checked={checkState}
          onChange={() => onCheck()}
        />
        <span className="slider round" />
      </label>
    </div>
  );
};

export default Switch;
