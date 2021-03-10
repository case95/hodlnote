import Joi from "joi";
import exchangeratesService from "../../utils/exchangeratesServices";

// List of valid values for the fiatCurrency schema
var fiatCurrencies = [];

// Populates fiatCurrency with all the fiat currencies names
const fetchFiatCurrencies = async () => {
  const fetchedData = await exchangeratesService();
  fetchedData.map((obj) => {
    fiatCurrencies.push(obj.id);
  });

  return fiatCurrencies;
};

fetchFiatCurrencies();

// ERROR: JOI CAN'T READ THE fiatCurrencies VALUES

const schema = Joi.object({
  fiatCurrency: Joi.string()
    .uppercase()
    .valid(...fiatCurrencies),
  cryptoCurrency: Joi.string().uppercase().valid("BTC", "ETH", "XRP"),
  fiatAmount: Joi.number().greater(0),
  cryptoAmount: Joi.number().greater(0),
  unitValue: Joi.number().greater(0),
});

const validate = (dataByValue) => {
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
  const data = { [currentTarget.name]: currentTarget.value };
  const result = schema.validate(data);
  if (!result.error) return null;
  return result.error.details[0].message;
};
export { schema, validate, validateInput };
