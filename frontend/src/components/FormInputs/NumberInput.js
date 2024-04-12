import { Field } from 'formik';

export const NumberInput = ({ name, label, ...props }) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <Field id={name} name={name} type="number" {...props} />
  </div>
);

