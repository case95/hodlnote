// List of valid values for the fiatCurrency schema

const validate = (dataByDate, schema) => {
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

// export const validateData = (name, dataByDate) => {
//   const data = {
//     [name]: dataByDate[name],
//   };
//   const result = schema.validate(data);
//   if (!result.error) return null;
//   return result.error.details[0].message;
// };

const validateInput = (currentTarget, schema) => {
  const data = { [currentTarget.name]: currentTarget.value };
  const result = schema.validate(data);
  if (!result.error) return null;
  return result.error.details[0].message;
};

export { validate, validateInput };
