import React from 'react';
import { useField } from 'formik';
import { TextInput, NumberInput, CheckboxInput, SelectInput, RadioButton } from '../FormInputs';

const FieldRenderer = ({ field, setSelectedField }) => {
  const [fieldProps, meta] = useField(field.id);

  const handleMouseUp = () => {
    setSelectedField(field);
  };

  const commonProps = {
    ...fieldProps,
    onMouseUp: handleMouseUp,
    label: field.label,
  };

  switch (field.type) {
    case 'text':
      return <TextInput {...commonProps} readOnly />;
    case 'number':
      return <NumberInput {...commonProps} readOnly/>;
    case 'checkbox':
      return <CheckboxInput {...commonProps} readOnly/>;
    case 'radio':
      return <RadioButton {...commonProps} readOnly/>;
    case 'select':
      return <SelectInput {...commonProps} readOnly/>;
    default:
      return null;
  }
};

export default FieldRenderer;