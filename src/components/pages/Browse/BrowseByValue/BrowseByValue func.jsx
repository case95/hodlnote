import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Joi from "joi";

// Importing custom components
import Input from "../../../reausable/Input/Input";
import Button from "../../../reausable/Button/Button";

const BrowseByValue = (...props) => {
  // Initialize history for re-routing to another page
  const history = useHistory();

  // Lists all the input informations for the map to create them
  const inputByValue = [
    {
      id: "fiatCurrency",
      label: "Fiat Currency",
      type: "text",
      placeholder: "Your FIAT Currency",
    },
    {
      id: "cryptoCurrency",
      label: "Crypto Currency",
      type: "text",
      placeholder: "Your Crypto Currency",
    },
    {
      id: "fiatAmount",
      label: "Fiat Amount",
      type: "number",
      placeholder: "Invested Amount in FIAT",
    },
    {
      id: "cryptoAmount",
      label: "Crypto Amount",
      type: "number",
      placeholder: "Invested Amount in Crypto",
    },
    {
      id: "unitValue",
      label: "Crypto unit value",
      type: "number",
      placeholder: "Crypto Value per Unit",
    },
  ];

  // State that stores the informations in the inputs
  const [dataByValue, setdataByValue] = useState({
    fiatCurrency: "",
    cryptoCurrency: "",
    fiatAmount: 0,
    cryptoAmount: 0,
    unitValue: 0,
  });

  const {
    fiatCurrency,
    cryptoCurrency,
    fiatAmount,
    cryptoAmount,
    unitValue,
  } = dataByValue;

  // Tracks all the Required labels needed for each input
  const [errorsState, setErrorsState] = useState([]);
  const [requiredState, setRequiredState] = useState({});

  // Creates a NodeList of all the inputs
  const inputs = Array.from(
    document.querySelectorAll(".browse-by-value-input")
  ).filter((input) => input.childNodes[1].disabled === false);

  // Creates an object containing the required state of each input
  useEffect(() => {
    inputs.map((input) => {
      const required = { [input.childNodes[1].id]: false };
      setRequiredState({
        ...requiredState,
        ...required,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schema = Joi.object({
    fiatCurrency: Joi.string().uppercase().valid("EUR", "USD", "AUD"),
    cryptoCurrency: Joi.string().uppercase().valid("BTC", "ETH", "XRP"),
    fiatAmount: Joi.number().greater(0),
    cryptoAmount: Joi.number().greater(0),
    unitValue: Joi.number().greater(0),
  });

  const validate = () => {
    const validationResult = schema.validate(dataByValue, {
      abortEarly: false,
    });
    if (!validationResult.error) return null;
    const errors = {};
    validationResult.error.details.map((error) => {
      return (errors[error.path[0]] = error.message);
    });
    return errors;
  };

  const validateInput = (currentTarget) => {
    //3. First lets create an object to validate.
    //we do not want to validate all fields so we will not use this.account
    const object = { [currentTarget.id]: currentTarget.value };
    //4. Validate the object using joi
    const result = schema.validate(object);
    //5. If no errors return null
    if (!result.error) return null;
    //6. Return error message
    return result.error.details[0].message;
  };

  // Clears the disabled input from the Required label
  useEffect(() => {
    const cryptoAmountInput = document.getElementById("cryptoAmount");
    const fiatAmountInput = document.getElementById("fiatAmount");
    if (cryptoAmount != false) {
      fiatAmountInput.parentElement.classList.remove("required");
    }
    if (fiatAmount != false) {
      cryptoAmountInput.parentElement.classList.remove("required");
    }
  }, [dataByValue]);

  // Handles input changes updating the state
  const onInputChange = (e) => {
    // Manages errors for error labels
    const errorMessage = validateInput(e.target);
    if (errorMessage) {
      setErrorsState({ ...errorsState, [e.target.id]: errorMessage });
    } else {
      delete errorsState[e.target.id];
    }
    // Manages requireds for required labels
    if (e.target.value == false) {
      setRequiredState({ ...requiredState, [e.target.id]: true });
    } else {
      setRequiredState({ ...requiredState, [e.target.id]: false });
    }
    // Manages the disabled input
    if (e.target.id === "fiatAmount") {
      const { cryptoAmount, ...other } = dataByValue;
      return setdataByValue({ ...other, [e.target.id]: e.target.value });
    } else if (e.target.id === "cryptoAmount") {
      const { fiatAmount, ...other } = dataByValue;
      return setdataByValue({ ...other, [e.target.id]: e.target.value });
    } else {
      return setdataByValue({ ...dataByValue, [e.target.id]: e.target.value });
    }
  };

  // Handles the submit and possible errors
  const onSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    setErrorsState(errors || {});
    inputs.forEach((input) => {
      if (input.childNodes[1].value == false) {
        input.classList.add("required");
      }
    });
    if (!errors) {
      history.push("/");
    }
  };

  return (
    <div className="browse-by-value" id="browse-by-value">
      <form onSubmit={(e) => onSubmit(e)} id="form" autocomplete="off">
        {inputByValue.map((input, index) => {
          const { id, label, type, placeholder } = input;
          switch (id) {
            case "fiatAmount":
              return (
                <Input
                  id={id}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  onChange={(e) => {
                    onInputChange(e);
                  }}
                  error={errorsState[id]}
                  requiredLabel={requiredState[id]}
                  key={id}
                  className="browse-by-value-input"
                  disabled={
                    "cryptoAmount" in dataByValue &&
                    cryptoAmount != false &&
                    !(
                      "fiatAmount" in dataByValue &&
                      fiatAmount != true &&
                      "cryptoAmount" in dataByValue &&
                      cryptoAmount != true
                    )
                  }
                  step=".01"
                />
              );
            case "cryptoAmount":
              return (
                <Input
                  id={id}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  onChange={(e) => {
                    onInputChange(e);
                  }}
                  error={errorsState[id]}
                  requiredLabel={requiredState[id]}
                  key={id}
                  className="browse-by-value-input"
                  disabled={
                    "fiatAmount" in dataByValue &&
                    fiatAmount != false &&
                    !(
                      "fiatAmount" in dataByValue &&
                      fiatAmount != true &&
                      "cryptoAmount" in dataByValue &&
                      cryptoAmount != true
                    )
                  }
                  step=".00000001"
                />
              );

            default:
              return (
                <Input
                  id={id}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  onChange={(e) => {
                    onInputChange(e);
                  }}
                  error={errorsState[id]}
                  requiredLabel={requiredState[id]}
                  key={id}
                  className="browse-by-value-input"
                />
              );
          }
        })}
        <div className="browse-by-value-confirmation">
          {"fiatAmount" in dataByValue &&
          fiatAmount != false &&
          unitValue != false &&
          fiatCurrency != false &&
          cryptoCurrency != false ? (
            <Fragment>
              You bought{" "}
              <span>
                {fiatAmount}
                {fiatCurrency}
              </span>{" "}
              worth of <span>{cryptoCurrency}</span> at{" "}
              <span>
                {unitValue}
                {fiatCurrency}
              </span>{" "}
              a unit, is that right?
            </Fragment>
          ) : undefined}
          {"cryptoAmount" in dataByValue &&
          cryptoAmount != false &&
          unitValue != false &&
          fiatCurrency != false &&
          cryptoCurrency != false ? (
            <Fragment>
              You bought{" "}
              <span>
                {cryptoAmount}
                {cryptoCurrency}
              </span>{" "}
              at{" "}
              <span>
                {unitValue}
                {fiatCurrency}
              </span>{" "}
              a unit, is that right?
            </Fragment>
          ) : undefined}
        </div>

        <Button type="submit" className="browse-by-value-button">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default BrowseByValue;
