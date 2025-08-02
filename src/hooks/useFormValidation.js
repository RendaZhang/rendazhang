import { useState } from 'react';

export default function useFormValidation(initialValues = {}, validators = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    const validator = validators[name];
    if (typeof validator === 'function') {
      return validator(value, values);
    }
    return '';
  };

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    for (const [name, validator] of Object.entries(validators)) {
      const value = values[name];
      const error = validator(value, values);
      if (error) {
        newErrors[name] = error;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, validateAll, reset };
}
