import React, { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";

// Importing custom components
import Input from "../../../reausable/Input/Input";
import Button from "../../../reausable/Button/Button";

const BrowseByDate = (...props) => {
  // Initialize history for re-routing to another page
  const history = useHistory();

  // Lists all the input informations for the map to create them
  const inputByDate = [
    {
      id: "date_periodStart",
      label: "Period Start",
      type: "date",
      placeholder: "Start Date to display",
    },
    {
      id: "date_periodEnd",
      label: "Period End",
      type: "date",
      placeholder: "End Date to display",
    },
    {
      id: "date_fiatCurrency",
      label: "Fiat Currency",
      type: "text",
      placeholder: "Your FIAT Currency",
    },
    {
      id: "date_cryptoCurrency",
      label: "Crypto Currency",
      type: "text",
      placeholder: "Your Crypto Currency",
    },
    {
      id: "date_fiatAmount",
      label: "Fiat Amount",
      type: "number",
      placeholder: "Invested Amount in FIAT",
    },
    {
      id: "date_cryptoAmount",
      label: "Crypto Amount",
      type: "number",
      placeholder: "Invested Amount in Crypto",
    },
  ];

  // State that stores the informations in the inputs
  const [dataByDate, setdataByDate] = useState({
    date_periodStart: "",
    date_periodEnd: "",
    date_fiatCurrency: "",
    date_cryptoCurrency: "",
    date_fiatAmount: 0,
    date_cryptoAmount: 0,
  });

  const {
    date_periodStart,
    date_periodEnd,
    date_fiatCurrency,
    date_cryptoCurrency,
    date_fiatAmount,
    date_cryptoAmount,
  } = dataByDate;

  // Tracks all the Required labels needed for each input
  const [errors, setErrors] = useState([]);

  // Creates a NodeList of all the inputs
  const inputs = document.querySelectorAll(".browse-by-date-input");

  // Creates an object containing the error state of each input
  useEffect(() => {
    var cleanErrors = {};
    inputs.forEach((input) => {
      const inputName = input.childNodes[1].id;
      cleanErrors = { ...cleanErrors, [inputName]: false };
    });
    setErrors({ ...cleanErrors });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handles input changes updating the state
  const onInputChange = (e) => {
    setdataByDate({ ...dataByDate, [e.target.id]: e.target.value });
  };

  // Clears the disabled input from the Required label
  useEffect(() => {
    const cryptoAmountInput = document.getElementById("date_cryptoAmount");
    const fiatAmountInput = document.getElementById("date_fiatAmount");
    if (date_cryptoAmount != false) {
      fiatAmountInput.parentElement.classList.remove("required");
    }
    if (date_fiatAmount != false) {
      cryptoAmountInput.parentElement.classList.remove("required");
    }
  }, [dataByDate]);

  // Handles the submit and possible errors
  const onSubmit = (e) => {
    e.preventDefault();
    var inputsValidator = [];
    const arrayOfInputs = Array.from(inputs);
    const filteredArrayOfInputs = arrayOfInputs.filter(
      (input) => input.childNodes[1].disabled === false
    );
    filteredArrayOfInputs.forEach((input) => {
      if (
        input.childNodes[1].value &&
        input.childNodes[1].value !== 0 &&
        input.childNodes[1].value !== "0"
      ) {
        inputsValidator.push(input.childNodes[1].value);
      } else {
        input.classList.add("required");
      }
    });
    if (filteredArrayOfInputs.length === inputsValidator.length) {
      history.push("/");
    } else {
      inputsValidator = [];
    }
  };

  return (
    <div className="browse-by-date" id="browse-by-date">
      <form onSubmit={(e) => onSubmit(e)} id="date_form" autocomplete="off">
        {inputByDate.map((input, index) => {
          const { id, label, type, placeholder } = input;
          switch (id) {
            case "date_fiatAmount":
              return (
                <Input
                  id={id}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  onChange={(e) => {
                    onInputChange(e);
                  }}
                  error={errors[id]}
                  key={id}
                  value={dataByDate[id]}
                  className="browse-by-date-input"
                  disabled={date_cryptoAmount != false}
                  step=".01"
                />
              );
            case "date_cryptoAmount":
              return (
                <Input
                  id={id}
                  label={label}
                  type={type}
                  placeholder={placeholder}
                  onChange={(e) => {
                    onInputChange(e);
                  }}
                  error={errors[id]}
                  key={id}
                  value={dataByDate[id]}
                  className="browse-by-date-input"
                  disabled={date_fiatAmount != false}
                  step=".00000001"
                />
              );
            case "date_cryptoCurrency":
              return (
                <Fragment>
                  <Input
                    id={id}
                    label={label}
                    type={type}
                    placeholder={placeholder}
                    onChange={(e) => {
                      onInputChange(e);
                    }}
                    error={errors[id]}
                    key={id}
                    value={dataByDate[id]}
                    className="browse-by-date-input"
                  />
                  <div className="browse-by-date-chart"></div>
                </Fragment>
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
                  error={errors[id]}
                  key={id}
                  value={dataByDate[id]}
                  className="browse-by-date-input"
                />
              );
          }
        })}
        <div className="browse-by-date-confirmation">
          {date_periodStart != false &&
          date_periodEnd != false &&
          (date_fiatAmount != false || date_cryptoAmount) &&
          date_fiatCurrency != false &&
          date_cryptoCurrency != false ? (
            <Fragment></Fragment>
          ) : undefined}
        </div>

        <Button type="submit" className="browse-by-date-button">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default BrowseByDate;
