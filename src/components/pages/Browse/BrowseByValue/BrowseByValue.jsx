import React, { Component, Fragment } from "react";
import Joi from "joi";

// Importing custom components
import Input from "../../../reausable/Input/Input";
import Button from "../../../reausable/Button/Button";

class BrowseByValue extends Component {
  state = {
    inputByValue: [
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
    ],
    dataByValue: {
      fiatCurrency: "",
      cryptoCurrency: "",
      fiatAmount: 0,
      cryptoAmount: 0,
      unitValue: 0,
    },
    errors: {},
    requireds: {},
  };

  schema = Joi.object({
    fiatCurrency: Joi.string().uppercase().valid("EUR", "USD", "AUD"),
    cryptoCurrency: Joi.string().uppercase().valid("BTC", "ETH", "XRP"),
    fiatAmount: Joi.number().greater(0),
    cryptoAmount: Joi.number().greater(0),
    unitValue: Joi.number().greater(0),
  });

  componentDidMount() {
    const requireds = {};
    const inputs = Array.from(
      document.querySelectorAll(".browse-by-value-input")
    ).filter((input) => input.childNodes[1].disabled === false);
    inputs.map((input) => {
      requireds[input.childNodes[1].id] = false;
    });
    this.setState({ requireds });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.dataByValue !== this.state.dataByValue) {
      const cryptoAmountInput = document.getElementById("cryptoAmount");
      const fiatAmountInput = document.getElementById("fiatAmount");
      if (this.state.dataByValue.cryptoAmount != false) {
        fiatAmountInput.parentElement.classList.remove("required");
      }
      if (this.state.dataByValue.fiatAmount != false) {
        cryptoAmountInput.parentElement.classList.remove("required");
      }
    }
  }

  validate = () => {
    const validationResult = this.schema.validate(this.state.dataByValue, {
      abortEarly: false,
    });
    if (!validationResult.error) return null;
    const errors = {};
    validationResult.error.details.map((error) => {
      return (errors[error.path[0]] = error.message);
    });
    return errors;
  };

  validateInput = (currentTarget) => {
    const data = { [currentTarget.id]: currentTarget.value };
    const result = this.schema.validate(data);
    if (!result.error) return null;
    return result.error.details[0].message;
  };

  onInputChange = (e) => {
    // Sets the input data in the data state

    const dataByValue = { ...this.state.dataByValue };

    dataByValue[e.target.id] = e.target.value;
    if (e.target.id === "fiatAmount") {
      delete dataByValue.cryptoAmount;
    } else if (e.target.id === "cryptoAmount") {
      delete dataByValue.fiatAmount;
    }
    this.setState({
      dataByValue,
    });

    // Manages errors for error labels

    const errors = { ...this.state.errors };
    const errorMessage = this.validateInput(e.target);

    if (errorMessage) {
      errors[e.target.id] = errorMessage;
    } else {
      delete errors[e.target.id];
    }
    if (e.target.id === "fiatAmount" && errors.cryptoAmount) {
      delete errors.cryptoAmount;
    } else if (e.target.id === "cryptoAmount" && errors.fiatAmount) {
      delete errors.fiatAmount;
    }
    this.setState({
      errors,
    });

    // Manages requireds for required labels

    const requireds = { ...this.state.requireds };

    if (e.target.value == false) {
      requireds[e.target.id] = true;
      if (e.target.id === "fiatAmount") {
        // Clears required label from the disabled input
        requireds.cryptoAmount = false;
      }
      if (e.target.id === "cryptoAmount") {
        // Clears required label from the disabled input
        requireds.fiatAmount = false;
      }
    } else {
      requireds[e.target.id] = false;
    }
    this.setState({
      requireds,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    const inputs = Array.from(
      document.querySelectorAll(".browse-by-value-input")
    ).filter((input) => input.childNodes[1].disabled === false);
    this.setState({ errors: errors || {} });
    // NEED TO SET REQIRED VIA STATE.REQUIREDS AND NOT BY CLASSLIST.ADD
    inputs.map((input) => {
      if (input.childNodes[1].value == false) {
        return input.classList.add("required");
      }
    });
    if (!errors) {
      this.props.history.push("/");
    }
  };

  render() {
    const {
      fiatCurrency,
      cryptoCurrency,
      fiatAmount,
      cryptoAmount,
      unitValue,
    } = this.state.dataByValue;
    return (
      <div className="browse-by-value" id="browse-by-value">
        <form onSubmit={(e) => this.onSubmit(e)} id="form" autocomplete="off">
          {this.state.inputByValue.map((input, index) => {
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
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[id]}
                    requiredLabel={this.state.requireds[id]}
                    key={id}
                    className="browse-by-value-input"
                    disabled={
                      "cryptoAmount" in this.state.dataByValue &&
                      cryptoAmount != false &&
                      !(
                        "fiatAmount" in this.state.dataByValue &&
                        fiatAmount != true &&
                        "cryptoAmount" in this.state.dataByValue &&
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
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[id]}
                    requiredLabel={this.state.requireds[id]}
                    key={id}
                    className="browse-by-value-input"
                    disabled={
                      "fiatAmount" in this.state.dataByValue &&
                      fiatAmount != false &&
                      !(
                        "fiatAmount" in this.state.dataByValue &&
                        fiatAmount != true &&
                        "cryptoAmount" in this.state.dataByValue &&
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
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[id]}
                    requiredLabel={this.state.requireds[id]}
                    key={id}
                    className="browse-by-value-input"
                  />
                );
            }
          })}
          <div className="browse-by-value-confirmation">
            {"fiatAmount" in this.state.dataByValue &&
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
            {"cryptoAmount" in this.state.dataByValue &&
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
  }
}

export default BrowseByValue;
