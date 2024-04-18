import React from 'react';
import { TextInput, NumberInput, CheckboxInput, RadioButton, SelectInput } from  '../FormInputs';

const fieldComponents = {
  TextInput,
  NumberInput,
  CheckboxInput,
  RadioButton,
  SelectInput
};

const FieldRenderer = ({ field }) => {
  const Component = fieldComponents[field.type];
  if (!Component) return null;

  return <Component {...field.props} name={field.name} label={field.label} />;
};

export default FieldRenderer;
