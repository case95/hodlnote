import JoiBase from "joi";
import JoiDate from "@hapi/joi-date";

const Joi = JoiBase.extend(JoiDate);

export const schema = Joi.object({
  periodStart: Joi.date().format("YYYY-MM-DD"),
  periodEnd: Joi.date().format("YYYY-MM-DD"),
  fiatCurrency: Joi.string().uppercase().valid("EUR", "USD", "AUD"),
  cryptoCurrency: Joi.string().uppercase().valid("BTC", "ETH", "XRP"),
  fiatAmount: Joi.number().greater(0),
  cryptoAmount: Joi.number().greater(0),
});

export const validate = (dataByDate) => {
  const validationResult = schema.validate(dataByDate, {
    abortEarly: false,
  });
  if (!validationResult.error) return null;
  const errors = {};
  validationResult.error.details.map((error) => {
    return (errors[error.path[0]] = error.message);
  });
  return errors;
};

export const validateData = (name, dataByDate) => {
  const data = {
    [name]: dataByDate[name],
  };
  const result = schema.validate(data);
  if (!result.error) return null;
  return result.error.details[0].message;
};

export const validateInput = (currentTarget) => {
  const data = { [currentTarget.name]: currentTarget.value };
  const result = schema.validate(data);
  if (!result.error) return null;
  return result.error.details[0].message;
};
