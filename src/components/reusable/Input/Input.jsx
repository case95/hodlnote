import React from "react";

import "./Input.css";

const Input = ({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
  required,
  error,
  requiredLabel,
  className,
  disabled,
  children,
  name,
  ...otherProps
}) => {
  const numberSanitizer = (e) => {
    if (type === "number") {
      const invalidChars = ["-", "+", "e"];
      if (invalidChars.includes(e.key) || e.which === 38 || e.which === 40) {
        e.preventDefault();
      }
    }
  };

  if (type !== "select") {
    return (
      <div
        className={`input ${
          (!disabled && requiredLabel) === true ? " required " : ""
        }  ${disabled === true ? " disabled " : ""}${className}`}
        id={`input-${id}`}
      >
        <label className="input-label" htmlFor={id}>
          {label}
        </label>
        <input
          className={`input-field `}
          required={required}
          id={id}
          type={type}
          min={type === "number" ? "0" : undefined}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            onChange(e);
          }}
          onKeyDown={(e) => {
            numberSanitizer(e);
          }}
          name={name}
          {...otherProps}
        ></input>
        {!disabled && error && <small>{error}</small>}
      </div>
    );
  } else {
    return (
      <div
        className={`input ${requiredLabel === true ? " required " : ""}  ${
          disabled === true ? " disabled " : ""
        }${className}`}
        id={`input-${id}`}
      >
        <label className="input-label" htmlFor={id}>
          {label}
        </label>
        <select
          className={`input-field `}
          required={required}
          id={id}
          type={type}
          min={type === "number" ? "0" : undefined}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            onChange(e);
          }}
          onKeyDown={(e) => {
            numberSanitizer(e);
          }}
          name={name}
          {...otherProps}
        >
          {children}
        </select>
        {!disabled && error && <small>{error}</small>}
      </div>
    );
  }
};

export default Input;
