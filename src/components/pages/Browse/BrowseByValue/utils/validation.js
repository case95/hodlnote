// List of valid values for the fiatCurrency schema

const validate = (dataByValue, schema) => {
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

const validateInput = (currentTarget, schema) => {
  const data = { [currentTarget.name]: currentTarget.value };
  const result = schema.validate(data);
  if (!result.error) return null;
  return result.error.details[0].message;
};

export { validate, validateInput };
