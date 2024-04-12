import { Field } from 'formik';

export const CheckboxInput = ({ name, label, ...props }) => (
  <div>
    <label>
      <Field name={name} type="checkbox" {...props} />
      {label}
    </label>
  </div>
);

