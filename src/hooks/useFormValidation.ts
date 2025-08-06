import { useState } from 'react';

type Validators<T extends Record<string, any>> = {
  [K in keyof T]?: (value: T[K], values: T) => string;
};

export default function useFormValidation<T extends Record<string, any>>(
  initialValues: T = {} as T,
  validators: Validators<T> = {}
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validateField = (name: keyof T, value: T[keyof T]): string => {
    const validator = validators[name];
    if (typeof validator === 'function') {
      return validator(value as T[keyof T], values);
    }
    return '';
  };

  const handleChange = (name: keyof T, value: T[keyof T]): void => {
    setValues((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    for (const [name, validator] of Object.entries(validators) as [
      keyof T,
      (value: any, values: T) => string
    ][]) {
      const value = values[name];
      const error = validator(value, values);
      if (error) {
        newErrors[name] = error;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = (): void => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, errors, handleChange, validateAll, reset };
}
