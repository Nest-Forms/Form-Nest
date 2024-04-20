import React from 'react';
import {TextInput} from '../FormInputs/';
// import other form field components here
import 'bootstrap/dist/css/bootstrap.css';

const FieldRenderer = ({ field, formik, setSelectedField }) => {
  const handleSelect = () => {
    setSelectedField(field);
  };

  switch (field.type) {
    case 'text':
      return (
        <div onClick={handleSelect}>
          <TextInput {...formik.getFieldProps(field.id)} />
        </div>
      );
    default:
      return null;
  }
};

export default FieldRenderer;