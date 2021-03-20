/* eslint-disable eqeqeq */
import React, { Component, Fragment } from "react";

// Importing custom components
import Input from "../../../reusable/Input/Input";
import Button from "../../../reusable/Button/Button";

import Joi from "joi";
import exchangeratesService from "../utils/exchangeratesServices";
import { validate, validateInput } from "./utils/validation";

class BrowseByValue extends Component {
  state = {
    inputByValue: [
      {
        name: "fiatCurrency",
        label: "Fiat Currency",
        type: "select",
        placeholder: "Your FIAT Currency",
      },
      {
        name: "cryptoCurrency",
        label: "Crypto Currency",
        type: "text",
        placeholder: "Your Crypto Currency",
      },
      {
        name: "fiatAmount",
        id: "fiatAmount",
        label: "Fiat Amount",
        type: "number",
        placeholder: "Invested Amount in FIAT",
      },
      {
        name: "cryptoAmount",
        id: "cryptoAmount",
        label: "Crypto Amount",
        type: "number",
        placeholder: "Invested Amount in Crypto",
      },
      {
        name: "unitValue",
        label: "Crypto unit value",
        type: "number",
        placeholder: "Crypto Value per Unit",
      },
    ],
    dataByValue: {
      fiatCurrency: "",
      cryptoCurrency: "",
      fiatAmount: null,
      cryptoAmount: null,
      unitValue: null,
    },
    errors: {},
    requireds: {},
    schema: {},
  };

  // Since we need to define a schema and it requires an api call to get all the available currencies we need to make componentDidMount synchronous.
  async componentDidMount() {
    const requireds = {};
    const inputs = Array.from(
      document.querySelectorAll(".browse-by-value-input")
    ).filter((input) => input.childNodes[1].disabled === false);
    inputs.map((input) => {
      return (requireds[input.childNodes[1].name] = false);
    });
    this.setState({ requireds });

    // This function takes the result of the exchangeratesService (an array of objects) and return a map with only the ids of each object.

    const fetchFiatCurrencies = async () => {
      const fetchedData = await exchangeratesService("USD");
      return fetchedData.map((obj) => obj.id);
    };

    // the result of the function is assigned to a const.
    const fiatCurrencies = await fetchFiatCurrencies();

    // we define the schema using the spreaded array of string as valid values for fiatCurrency

    const schema = Joi.object({
      fiatCurrency: Joi.string()
        .uppercase()
        .valid(...fiatCurrencies),
      cryptoCurrency: Joi.string().uppercase().valid("BTC", "ETH", "XRP"),
      fiatAmount: Joi.number().greater(0),
      cryptoAmount: Joi.number().greater(0),
      unitValue: Joi.number().greater(0),
    });
    this.setState({ schema });
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

  onInputChange = (e) => {
    // Sets the input data in the data state

    const dataByValue = { ...this.state.dataByValue };

    dataByValue[e.target.name] = e.target.value.toUpperCase();
    if (e.target.name === "fiatAmount") {
      delete dataByValue.cryptoAmount;
    } else if (e.target.name === "cryptoAmount") {
      delete dataByValue.fiatAmount;
    }
    this.setState({
      dataByValue,
    });

    // Manages errors for error labels

    const errors = { ...this.state.errors };
    const errorMessage = validateInput(e.target, this.state.schema);

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
  };

  onSubmit = (e) => {
    e.preventDefault();

    const errors = validate(this.state.dataByValue, this.state.schema);
    const inputs = Array.from(
      document.querySelectorAll(".browse-by-value-input")
    ).filter((input) => input.childNodes[1].disabled === false);
    this.setState({ errors: errors || {} });
    // NEED TO SET REQIRED VIA STATE.REQUIREDS AND NOT BY CLASSLIST.ADD
    inputs.map((input) => {
      if (input.childNodes[1].value == false) {
        return input.classList.add("required");
      }
      return undefined;
    });
    if (!errors) {
      const fiatCurrencyData = this.props.fiatCurrencies.find(
        (obj) => this.state.dataByValue.fiatCurrency === obj.id
      );

      const walletList = [...this.props.walletsList];

      if ("fiatAmount" in this.state.dataByValue) {
        const amountInBaseCurrency = parseFloat(
          (this.state.dataByValue.fiatAmount / fiatCurrencyData.value).toFixed(
            2
          )
        );

        const cryptoAmount = parseFloat(
          (
            this.state.dataByValue.fiatAmount / this.state.dataByValue.unitValue
          ).toFixed(8)
        );
        const transaction = {
          fiatAmount: amountInBaseCurrency,
          cryptoAmount,
          cryptoCurrency: this.state.dataByValue.cryptoCurrency,
        };

        let walletIndex = null;

        if (
          walletList.findIndex((wallet) => {
            return wallet.cryptoCurrency === transaction.cryptoCurrency;
          }) !== -1
        ) {
          walletIndex = walletList.findIndex((wallet) => {
            return wallet.cryptoCurrency === transaction.cryptoCurrency;
          });
        } else {
          walletList.push({
            fiatCurrency: "USD",
            cryptoCurrency: transaction.cryptoCurrency,
            transactions: [],
          });
          walletIndex = walletList.length - 1;
        }

        walletList[walletIndex].transactions.push(transaction);
      } else {
        const unitValueInBaseCurrency =
          this.state.dataByValue.unitValue / fiatCurrencyData.value;

        const amountInBaseCurrency = parseFloat(
          parseFloat(
            (
              this.state.dataByValue.cryptoAmount * unitValueInBaseCurrency
            ).toFixed(2)
          )
        );

        const cryptoAmount = parseFloat(
          parseFloat(parseFloat(this.state.dataByValue.cryptoAmount).toFixed(8))
        );

        const transaction = {
          fiatAmount: amountInBaseCurrency,
          cryptoAmount,
          cryptoCurrency: this.state.dataByValue.cryptoCurrency,
        };

        let walletIndex = null;

        if (
          walletList.findIndex((wallet) => {
            return wallet.cryptoCurrency === transaction.cryptoCurrency;
          }) !== -1
        ) {
          walletIndex = walletList.findIndex((wallet) => {
            return wallet.cryptoCurrency === transaction.cryptoCurrency;
          });
        } else {
          walletList.push({
            fiatCurrency: "USD",
            cryptoCurrency: transaction.cryptoCurrency,
            transactions: [],
          });
          walletIndex = walletList.length - 1;
        }

        walletList[walletIndex].transactions.push(transaction);
      }
      this.props.setWalletList([...walletList]);
      localStorage.setItem("wallets", JSON.stringify(walletList));
      this.props.history.push("/wallets");
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
        <form onSubmit={(e) => this.onSubmit(e)} id="form" autoComplete="off">
          {this.state.inputByValue.map((input, index) => {
            const { id, label, type, placeholder, name } = input;
            switch (name) {
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
                    error={this.state.errors[name]}
                    requiredLabel={this.state.requireds[name]}
                    key={name}
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
                    value={this.state.dataByValue[name]}
                    name={name}
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
                    error={this.state.errors[name]}
                    requiredLabel={this.state.requireds[name]}
                    key={name}
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
                    value={this.state.dataByValue[name]}
                    name={name}
                  />
                );
              case "fiatCurrency":
                return (
                  <Input
                    label={label}
                    type={type}
                    placeholder={placeholder}
                    onChange={(e) => {
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[name]}
                    requiredLabel={this.state.requireds[name]}
                    key={name}
                    className="browse-by-value-input"
                    value={this.state.dataByValue[name]}
                    name={name}
                  >
                    <option defaultValue value={""}>
                      Select an option
                    </option>
                    {/* fiatCurrencies is an array of objects {id: currency name , value: its value compared to dollar} received by the Browse page state */}
                    {this.props.fiatCurrencies.map((currency) => {
                      return (
                        <option value={currency.id} key={currency.id}>
                          {currency.id}
                        </option>
                      );
                    })}
                  </Input>
                );

              default:
                return (
                  <Input
                    label={label}
                    type={type}
                    placeholder={placeholder}
                    onChange={(e) => {
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[name]}
                    requiredLabel={this.state.requireds[name]}
                    key={name}
                    className="browse-by-value-input"
                    value={this.state.dataByValue[name]}
                    name={name}
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
