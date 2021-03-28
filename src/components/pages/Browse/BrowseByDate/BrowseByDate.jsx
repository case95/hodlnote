/*eslint eqeqeq: "off"*/
import React, { Component, Fragment } from "react";

// Importing custom components
import Input from "../../../reusable/Input/Input";
import Button from "../../../reusable/Button/Button";
import Chart from "../../../reusable/Chart/Chart";

import JoiBase from "joi";
import JoiDate from "@hapi/joi-date";

import exchangeratesService from "../utils/exchangeratesServices";
import { getHistoricalData } from "./utils/coinbaseServices";

import { validate, validateInput } from "./utils/validation";

const Joi = JoiBase.extend(JoiDate);

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
      periodStart: undefined,
      periodEnd: undefined,
      fiatCurrency: "",
      cryptoCurrency: "",
      unitValue: undefined,
      fiatAmount: undefined,
      cryptoAmount: undefined,
    },
    errors: {},
    requireds: {},
    schema: {},
    chartData: {},
  };

  async componentDidMount() {
    const requireds = {};
    const inputs = Array.from(
      document.querySelectorAll(".browse-by-date-input")
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
      periodStart: Joi.date().format("YYYY-MM-DD"),
      periodEnd: Joi.date().format("YYYY-MM-DD"),
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

  async componentDidUpdate(prevProps, prevState) {
    const isDataChanged =
      prevState.dataByDate.periodStart !== this.state.dataByDate.periodStart ||
      prevState.dataByDate.periodEnd !== this.state.dataByDate.periodEnd ||
      prevState.dataByDate.cryptoCurrency !==
        this.state.dataByDate.cryptoCurrency;

    const isDataNotEmpty =
      this.state.dataByDate.periodStart !== "" &&
      this.state.dataByDate.periodEnd !== "" &&
      this.state.dataByDate.cryptoCurrency !== "";

    if (isDataChanged && isDataNotEmpty) {
      this.setChartData();
    } else {
      return undefined;
    }
  }

  setChartData = async () => {
    const { periodStart, periodEnd, cryptoCurrency } = this.state.dataByDate;

    function getGranularity(periodStart, periodEnd) {
      const millInDay = 86400000;
      const dateStart = new Date(periodStart);
      const dateEnd = new Date(periodEnd);
      const timerange = dateEnd - dateStart;

      function setGranularity(timerange, millInDay) {
        if (timerange <= 0) {
          console.log("Dates are not valid.");
          return 0;
        } else if (timerange > millInDay * 300) {
          console.log("Choose a time range of 300 days or less.");
          return 0;
        } else if (timerange > millInDay * 75) {
          return 86400;
        } else if (timerange > millInDay * 12.5) {
          return 21600;
        } else {
          return 3600;
        }
      }

      console.log("TIMERANGE: ", timerange);
      console.log("75 DAYS IN MILL: ", millInDay * 75);

      const granularity = setGranularity(timerange, millInDay);

      console.log("GRANULARITYY: ", granularity);

      return granularity;
    }

    function formatDate(fullDate, granularity) {
      if (granularity !== 0) {
        const year = fullDate.getFullYear();
        const month = fullDate.getMonth();
        const date = fullDate.getDate();
        const hours = fullDate.getHours();
        const minutes = fullDate.getMinutes();
        if (granularity === 86400) {
          const finalDate = `${date}-${month}-${year}`;
          return [finalDate];
        } else {
          const finalDate = `${date}-${month}-${year}`;
          const finalTime = `${hours}:${minutes}`;
          return [finalDate, finalTime];
        }
      }
      console.log("ERROR");
      return undefined;
    }

    const errors = validate(
      { periodStart, periodEnd, cryptoCurrency },
      this.state.schema
    );

    if (!errors) {
      const granularity = getGranularity(periodStart, periodEnd);
      let datesArray = [];

      await getHistoricalData(
        this.state.dataByDate.cryptoCurrency,
        this.state.dataByDate.periodStart,
        this.state.dataByDate.periodEnd
      )
        .then((fetchedData) => {
          fetchedData.map((data) => {
            const fullDate = new Date(data[0] * 1000);
            const formattedDate = formatDate(fullDate, granularity);
            return datesArray.push(formattedDate);
          });
        })
        .catch((e) => console.log(e));

      console.log("DATES ARRAY: ", datesArray);
    } else {
      console.log("THERE IS NOT DATA");
    }
  };

  onInputChange = (e) => {
    // Sets the input data in the data state

    const dataByDate = { ...this.state.dataByDate };

    dataByDate[e.target.name] = e.target.value.toUpperCase();

    if (e.target.name === "fiatAmount") {
      delete dataByDate.cryptoAmount;
    }

    if (e.target.name === "cryptoAmount") {
      delete dataByDate.fiatAmount;
    }

    this.setState({
      dataByDate,
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

    const errors = validate(this.state.dataByDate, this.state.schema);
    const inputs = Array.from(
      document.querySelectorAll(".browse-by-date-input")
    ).filter((input) => input.childNodes[1].disabled === false);
    this.setState({ errors: errors || {} });
    // NEED TO SET REQIRED VIA STATE.REQUIREDS AND NOT BY CLASSLIST.ADD
    const requireds = {};
    inputs.map((input) => {
      if (input.childNodes[1].value == false) {
        return (requireds[input.childNodes[1].name] = true);
      }
      return undefined;
    });
    this.setState({ requireds });

    if (!errors) {
      const fiatCurrencyData = this.props.fiatCurrencies.find(
        (obj) => this.state.dataByDate.fiatCurrency === obj.id
      );

      const walletList = [...this.props.walletsList];

      if ("fiatAmount" in this.state.dataByDate) {
        const amountInBaseCurrency = parseFloat(
          (this.state.dataByDate.fiatAmount / fiatCurrencyData.value).toFixed(2)
        );

        const cryptoAmount = parseFloat(
          (
            this.state.dataByDate.fiatAmount / this.state.dataByDate.unitValue
          ).toFixed(8)
        );
        const transaction = {
          fiatAmount: amountInBaseCurrency,
          cryptoAmount,
          cryptoCurrency: this.state.dataByDate.cryptoCurrency,
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
          this.state.dataByDate.unitValue / fiatCurrencyData.value;

        const amountInBaseCurrency = parseFloat(
          parseFloat(
            (
              this.state.dataByDate.cryptoAmount * unitValueInBaseCurrency
            ).toFixed(2)
          )
        );

        const cryptoAmount = parseFloat(
          parseFloat(parseFloat(this.state.dataByDate.cryptoAmount).toFixed(8))
        );

        const transaction = {
          fiatAmount: amountInBaseCurrency,
          cryptoAmount,
          cryptoCurrency: this.state.dataByDate.cryptoCurrency,
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
                    key={`browse-by-date-input-${index}`}
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
                    requiredLabel={this.state.requireds[name]}
                    onChange={(e) => {
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[name]}
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
                    key={`browse-by-date-input-${index}`}
                    name={name}
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
                      className="browse-by-date-input"
                      value={this.state.dataByDate[name]}
                      key={`browse-by-date-input-${index}`}
                      name={name}
                    />

                    <div className="chart-container">
                      <Chart data={this.state.chartData}></Chart>
                    </div>
                  </Fragment>
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
                    key={`browse-by-date-input-${index}`}
                    className="browse-by-date-input"
                    value={this.state.dataByDate[name]}
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
                    requiredLabel={this.state.requireds[name]}
                    onChange={(e) => {
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[name]}
                    className="browse-by-date-input"
                    value={this.state.dataByDate[name]}
                    key={`browse-by-date-input-${index}`}
                    name={name}
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
