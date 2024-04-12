import { Field } from 'formik';

export const TextInput = ({ name, label, ...props }) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <Field id={name} name={name} type="text" {...props} />
  </div>
);

