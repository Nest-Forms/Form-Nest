import { Field } from 'formik';

export const SelectInput = ({ name, label, options, ...props }) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <Field name={name} as="select" {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
  </div>
);

