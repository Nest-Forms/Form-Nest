import { Field } from 'formik';

export const RadioButton = ({ name, label, options }) => (
  <div>
    <p>{label}</p>
    {options.map((option) => (
      <label key={option.value}>
        <Field type="radio" name={name} value={option.value} />
        {option.label}
      </label>
    ))}
  </div>
);

