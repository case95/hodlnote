import React, { Component, Fragment } from "react";

// Importing custom components
import Input from "../../../reusable/Input/Input";
import Button from "../../../reusable/Button/Button";

import { validate, validateData, validateInput } from "./utils/validation";

class BrowseByDate extends Component {
  state = {
    // Lists all the input informations for the map to create them
    inputByDate: [
      {
        name: "periodStart",
        label: "Period Start",
        type: "date",
        placeholder: "Start Date to display",
      },
      {
        name: "periodEnd",
        label: "Period End",
        type: "date",
        placeholder: "End Date to display",
      },
      {
        name: "fiatCurrency",
        label: "Fiat Currency",
        type: "text",
        placeholder: "Your FIAT Currency",
      },
      {
        name: "cryptoCurrency",
        label: "Crypto Currency",
        type: "text",
        placeholder: "Your Crypto Currency",
      },
      {
        id: "date_fiatAmount",
        name: "fiatAmount",
        label: "Fiat Amount",
        type: "number",
        placeholder: "Invested Amount in FIAT",
      },
      {
        id: "date_cryptoAmount",
        name: "cryptoAmount",
        label: "Crypto Amount",
        type: "number",
        placeholder: "Invested Amount in Crypto",
      },
    ],
    dataByDate: {
      periodStart: "",
      periodEnd: "",
      fiatCurrency: "",
      cryptoCurrency: "",
      fiatAmount: null,
      cryptoAmount: null,
    },
    errors: {},
    requireds: {},
  };

  componentDidMount() {
    const requireds = {};
    const inputs = Array.from(
      document.querySelectorAll(".browse-by-date-input")
    ).filter((input) => input.childNodes[1].disabled === false);
    inputs.map((input) => {
      requireds[input.childNodes[1].name] = false;
    });
    this.setState({ requireds });
  }

  // NEED TO CHECK THIS
  componentDidUpdate(previousProps, previousState) {
    if (
      previousState.dataByDate.cryptoAmount !==
        this.state.dataByDate.cryptoAmount ||
      previousState.dataByDate.fiatAmount !== this.state.dataByDate.fiatAmount
    ) {
      const cryptoAmountInput = document.getElementById("date_cryptoAmount");
      const fiatAmountInput = document.getElementById("date_fiatAmount");
      if (this.state.dataByDate.cryptoAmount != false) {
        fiatAmountInput.parentElement.classList.remove("required");
      }
      if (this.state.dataByDate.fiatAmount != false) {
        cryptoAmountInput.parentElement.classList.remove("required");
      }
    }
  }

  onInputChange = (e) => {
    // Sets the input data in the data state

    const dataByDate = { ...this.state.dataByDate };

    if (e.target.name === "fiatAmount") {
      delete dataByDate.cryptoAmount;
    }
    if (e.target.name === "cryptoAmount") {
      delete dataByDate.fiatAmount;
    }

    dataByDate[e.target.name] = e.target.value;

    this.setState(
      {
        dataByDate,
      },
      () => {
        // Manages errors for error labels

        const errors = { ...this.state.errors };
        if (e.target.name === "periodStart" || e.target.name === "periodEnd") {
          const errorMessage = validateData(
            e.target.name,
            this.state.dataByDate
          );
          if (errorMessage) {
            errors[e.target.name] = errorMessage;
          } else {
            delete errors[e.target.name];
          }
        } else {
          const errorMessage = validateInput(e.target);

          if (errorMessage) {
            errors[e.target.name] = errorMessage;
          } else {
            delete errors[e.target.name];
          }
          if (e.target.name === "fiatAmount" && errors.cryptoAmount) {
            delete errors.cryptoAmount;
          } else if (e.target.name === "cryptoAmount" && errors.fiatAmount) {
            delete errors.fiatAmount;
          }
        }

        this.setState({
          errors,
        });

        // Manages requireds for required labels

        const requireds = { ...this.state.requireds };

        if (e.target.value == false) {
          requireds[e.target.name] = true;
          if (e.target.name === "fiatAmount") {
            // Clears required label from the disabled input
            requireds.cryptoAmount = false;
          }
          if (e.target.name === "cryptoAmount") {
            // Clears required label from the disabled input
            requireds.fiatAmount = false;
          }
        } else {
          requireds[e.target.name] = false;
        }
        this.setState({
          requireds,
        });
      }
    );
  };

  onSubmit = (e) => {
    e.preventDefault();

    const errors = validate(this.state.dataByDate);
    const inputs = Array.from(
      document.querySelectorAll(".browse-by-date-input")
    ).filter((input) => input.childNodes[1].disabled === false);
    this.setState({ errors: errors || {} });
    // NEED TO SET REQIRED VIA STATE.REQUIREDS AND NOT BY CLASSLIST.ADD
    inputs.map((input) => {
      if (input.childNodes[1].value == false) {
        return input.classList.add("required");
      }
    });
    if (!errors) {
      //REDIRECT NOT WORKING
      this.props.history.push("/");
    }
  };

  render() {
    const {
      fiatCurrency,
      cryptoCurrency,
      fiatAmount,
      cryptoAmount,
    } = this.state.dataByDate;

    return (
      <div className="browse-by-date" id="browse-by-date">
        <form
          onSubmit={(e) => this.onSubmit(e)}
          id="date_form"
          autoComplete="off"
        >
          {this.state.inputByDate.map((input, index) => {
            const { id, label, type, placeholder, name } = input;
            switch (name) {
              case "fiatAmount":
                return (
                  <Input
                    id={id}
                    label={label}
                    type={type}
                    placeholder={placeholder}
                    requiredLabel={this.state.requireds[name]}
                    onChange={(e) => {
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[name]}
                    key={name}
                    className="browse-by-date-input"
                    disabled={
                      "cryptoAmount" in this.state.dataByDate &&
                      cryptoAmount != false &&
                      !(
                        "fiatAmount" in this.state.dataByDate &&
                        fiatAmount != true &&
                        "cryptoAmount" in this.state.dataByDate &&
                        cryptoAmount != true
                      )
                    }
                    step=".01"
                    name={name}
                    key={`browse-by-date-input-${index}`}
                  />
                );
              case "cryptoAmount":
                return (
                  <Input
                    id={id}
                    label={label}
                    type={type}
                    placeholder={placeholder}
                    requiredLabel={this.state.requireds[name]}
                    onChange={(e) => {
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[name]}
                    key={name}
                    className="browse-by-date-input"
                    disabled={
                      "fiatAmount" in this.state.dataByDate &&
                      fiatAmount != false &&
                      !(
                        "fiatAmount" in this.state.dataByDate &&
                        fiatAmount != true &&
                        "cryptoAmount" in this.state.dataByDate &&
                        cryptoAmount != true
                      )
                    }
                    step=".00000001"
                    value={this.state.dataByDate[name]}
                    name={name}
                    key={`browse-by-date-input-${index}`}
                  />
                );
              case "cryptoCurrency":
                return (
                  <Fragment key={`frag-${index}`}>
                    <Input
                      label={label}
                      type={type}
                      placeholder={placeholder}
                      requiredLabel={this.state.requireds[name]}
                      onChange={(e) => {
                        this.onInputChange(e);
                      }}
                      error={this.state.errors[name]}
                      key={name}
                      className="browse-by-date-input"
                      value={this.state.dataByDate[name]}
                      name={name}
                      key={`browse-by-date-input-${index}`}
                    />
                    <div className="browse-by-date-chart"></div>
                  </Fragment>
                );

              default:
                return (
                  <Input
                    label={label}
                    type={type}
                    placeholder={placeholder}
                    requiredLabel={this.state.requireds[name]}
                    onChange={(e) => {
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[name]}
                    key={name}
                    className="browse-by-date-input"
                    value={this.state.dataByDate[name]}
                    name={name}
                    key={`browse-by-date-input-${index}`}
                  />
                );
            }
          })}
          <div className="browse-by-date-confirmation">
            {"fiatAmount" in this.state.dataByDate &&
            fiatAmount != false &&
            fiatCurrency != false &&
            cryptoCurrency != false ? (
              <Fragment>
                {" "}
                You bought{" "}
                <span>
                  {fiatAmount}
                  {fiatCurrency}
                </span>{" "}
                worth of <span>{cryptoCurrency}</span> at{" "}
                <span>XXX{fiatCurrency}</span> a unit, is that right?
              </Fragment>
            ) : undefined}

            {"cryptoAmount" in this.state.dataByDate &&
            cryptoAmount != false &&
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
                  XXX
                  {fiatCurrency}
                </span>{" "}
                a unit, is that right?
              </Fragment>
            ) : undefined}
          </div>

          <Button type="submit" className="browse-by-date-button">
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

export default BrowseByDate;
