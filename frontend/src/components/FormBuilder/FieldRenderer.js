import React from 'react';
import { useField } from 'formik';

const FieldRenderer = ({ field, setSelectedField }) => {
  const [fieldProps, meta] = useField(field.id);

  const handleSelectField = () => {
    setSelectedField(field);
  };

  switch (field.type) {
    case 'text':
      return (
        <input type="text" {...fieldProps} onClick={handleSelectField} />
      );
    case 'number':
      return (
        <input type="number" {...fieldProps} onClick={handleSelectField} />
      );
    case 'checkbox':
      return (
        <input type="checkbox" {...fieldProps} onClick={handleSelectField} />
      );
    case 'radio':
      return (
        <input type="radio" {...fieldProps} onClick={handleSelectField} />
      );
    default:
      return null;
  }
};

export default FieldRenderer;