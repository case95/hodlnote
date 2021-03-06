import React, { Component, Fragment } from "react";
import JoiBase from "joi";
import JoiDate from "@hapi/joi-date";

// Importing custom components
import Input from "../../../reausable/Input/Input";
import Button from "../../../reausable/Button/Button";

const Joi = JoiBase.extend(JoiDate);

class BrowseByDate extends Component {
  state = {
    // Lists all the input informations for the map to create them
    inputByDate: [
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
    ],
    dataByDate: {
      date_periodStart: "",
      date_periodEnd: "",
      date_fiatCurrency: "",
      date_cryptoCurrency: "",
      date_fiatAmount: 0,
      date_cryptoAmount: 0,
    },
    errors: {},
    requireds: {},
  };

  schema = Joi.object({
    date_periodStart: Joi.date().format("DD-MM-YYYY"),
    date_periodEnd: Joi.date().format("DD-MM-YYYY"),
    date_fiatCurrency: Joi.string().uppercase().valid("EUR", "USD", "AUD"),
    date_cryptoCurrency: Joi.string().uppercase().valid("BTC", "ETH", "XRP"),
    date_fiatAmount: Joi.number().greater(0),
    date_cryptoAmount: Joi.number().greater(0),
  });

  componentDidMount() {
    const requireds = {};
    const inputs = Array.from(
      document.querySelectorAll(".browse-by-date-input")
    ).filter((input) => input.childNodes[1].disabled === false);
    inputs.map((input) => {
      requireds[input.childNodes[1].id] = false;
    });
    this.setState({ requireds });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousState.dataByDate !== this.state.dataByDate) {
      const cryptoAmountInput = document.getElementById("date_cryptoAmount");
      const fiatAmountInput = document.getElementById("date_fiatAmount");
      if (this.state.dataByDate.date_cryptoAmount != false) {
        fiatAmountInput.parentElement.classList.remove("required");
      }
      if (this.state.dataByDate.date_fiatAmount != false) {
        cryptoAmountInput.parentElement.classList.remove("required");
      }
    }
  }

  validate = () => {
    const validationResult = this.schema.validate(this.state.dataByDate, {
      abortEarly: false,
    });
    if (!validationResult.error) return null;
    const errors = {};
    validationResult.error.details.map((error) => {
      return (errors[error.path[0]] = error.message);
    });
    return errors;
  };

  validateData = (id) => {
    const data = {
      [id]: this.state.dataByDate[id],
    };
    const result = this.schema.validate(data);
    console.log(result);
    if (!result.error) return null;
    return result.error.details[0].message;
  };

  validateInput = (currentTarget) => {
    const data = { [currentTarget.id]: currentTarget.value };
    const result = this.schema.validate(data);
    if (!result.error) return null;
    return result.error.details[0].message;
  };

  onInputChange = (e) => {
    // Sets the input data in the data state

    const dataByDate = { ...this.state.dataByDate };

    if (e.target.id === "date_fiatAmount") {
      delete dataByDate.date_cryptoAmount;
    }
    if (e.target.id === "date_cryptoAmount") {
      delete dataByDate.date_fiatAmount;
    }
    if (
      e.target.id === "date_periodStart" ||
      e.target.id === "date_periodEnd"
    ) {
      var dateArray = e.target.value.split("-");
      const cleanDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
      dataByDate[e.target.id] = cleanDate;
    } else {
      dataByDate[e.target.id] = e.target.value;
    }

    this.setState(
      {
        dataByDate,
      },
      () => {
        // Manages errors for error labels

        const errors = { ...this.state.errors };
        if (
          e.target.id === "date_periodStart" ||
          e.target.id === "date_periodEnd"
        ) {
          const errorMessage = this.validateData(e.target.id);
          if (errorMessage) {
            errors[e.target.id] = errorMessage;
          } else {
            delete errors[e.target.id];
          }
        } else {
          const errorMessage = this.validateInput(e.target);

          if (errorMessage) {
            errors[e.target.id] = errorMessage;
          } else {
            delete errors[e.target.id];
          }
          if (e.target.id === "date_fiatAmount" && errors.date_cryptoAmount) {
            delete errors.date_cryptoAmount;
          } else if (
            e.target.id === "date_cryptoAmount" &&
            errors.date_fiatAmount
          ) {
            delete errors.date_fiatAmount;
          }
        }

        this.setState({
          errors,
        });

        // Manages requireds for required labels

        const requireds = { ...this.state.requireds };

        if (e.target.value == false) {
          requireds[e.target.id] = true;
          if (e.target.id === "date_fiatAmount") {
            // Clears required label from the disabled input
            requireds.date_cryptoAmount = false;
          }
          if (e.target.id === "date_cryptoAmount") {
            // Clears required label from the disabled input
            requireds.date_fiatAmount = false;
          }
        } else {
          requireds[e.target.id] = false;
        }
        this.setState({
          requireds,
        });
      }
    );
  };

  onSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
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
      date_fiatCurrency,
      date_cryptoCurrency,
      date_fiatAmount,
      date_cryptoAmount,
    } = this.state.dataByDate;

    return (
      <div className="browse-by-date" id="browse-by-date">
        <form
          onSubmit={(e) => this.onSubmit(e)}
          id="date_form"
          autocomplete="off"
        >
          {this.state.inputByDate.map((input, index) => {
            const { id, label, type, placeholder } = input;
            switch (id) {
              case "date_fiatAmount":
                return (
                  <Input
                    id={id}
                    label={label}
                    type={type}
                    placeholder={placeholder}
                    requiredLabel={this.state.requireds[id]}
                    onChange={(e) => {
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[id]}
                    key={id}
                    className="browse-by-date-input"
                    disabled={
                      "date_cryptoAmount" in this.state.dataByDate &&
                      date_cryptoAmount != false &&
                      !(
                        "date_fiatAmount" in this.state.dataByDate &&
                        date_fiatAmount != true &&
                        "date_cryptoAmount" in this.state.dataByDate &&
                        date_cryptoAmount != true
                      )
                    }
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
                    requiredLabel={this.state.requireds[id]}
                    onChange={(e) => {
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[id]}
                    key={id}
                    className="browse-by-date-input"
                    disabled={
                      "date_fiatAmount" in this.state.dataByDate &&
                      date_fiatAmount != false &&
                      !(
                        "date_fiatAmount" in this.state.dataByDate &&
                        date_fiatAmount != true &&
                        "date_cryptoAmount" in this.state.dataByDate &&
                        date_cryptoAmount != true
                      )
                    }
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
                      requiredLabel={this.state.requireds[id]}
                      onChange={(e) => {
                        this.onInputChange(e);
                      }}
                      error={this.state.errors[id]}
                      key={id}
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
                    requiredLabel={this.state.requireds[id]}
                    onChange={(e) => {
                      this.onInputChange(e);
                    }}
                    error={this.state.errors[id]}
                    key={id}
                    className="browse-by-date-input"
                  />
                );
            }
          })}
          <div className="browse-by-date-confirmation">
            {"date_fiatAmount" in this.state.dataByDate &&
            date_fiatAmount != false &&
            date_fiatCurrency != false &&
            date_cryptoCurrency != false ? (
              <Fragment>
                {" "}
                You bought{" "}
                <span>
                  {date_fiatAmount}
                  {date_fiatCurrency}
                </span>{" "}
                worth of <span>{date_cryptoCurrency}</span> at{" "}
                <span>XXX{date_fiatCurrency}</span> a unit, is that right?
              </Fragment>
            ) : undefined}

            {"date_cryptoAmount" in this.state.dataByDate &&
            date_cryptoAmount != false &&
            date_fiatCurrency != false &&
            date_cryptoCurrency != false ? (
              <Fragment>
                You bought{" "}
                <span>
                  {date_cryptoAmount}
                  {date_cryptoCurrency}
                </span>{" "}
                at{" "}
                <span>
                  XXX
                  {date_fiatCurrency}
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
