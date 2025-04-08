
export const validate = (data, schema) => {
  const { error } = schema.validate(data, { abortEarly: false });

  if (!error) return null;

  const newErrors = {};
  error.details.forEach((detail) => {
    newErrors[detail.path[0]] = detail.message;
  });

  return newErrors;
};
