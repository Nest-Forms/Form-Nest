import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { TextInput, NumberInput, CheckboxInput, SelectInput, RadioButton } from '../FormInputs';

const FieldConfigurator = ({ field, setSelectedField, updateFieldConfig }) => {
  const FieldComponent = { text: TextInput, number: NumberInput, checkbox: CheckboxInput, select: SelectInput, radio: RadioButton }[field.type];

  const handleBack = () => {
    setSelectedField(null);
  };

  const handleChange = (name, value) => {
    updateFieldConfig(field.id, { [name]: value });
  };

  const config = field.config || {};

  return (
    <div className="border p-2">
      <button onClick={handleBack} className="btn btn-secondary mb-2">Back</button>
      <h5>Configure {field.type}</h5>
      {FieldComponent.configFields.map(({ name, label, type }) => (
        <div className="form-group" key={name}>
          <label>{label}</label>
          <input 
            type={type} 
            name={name} 
            value={config[name] || ''} 
            onChange={e => handleChange(name, e.target.value)} 
            className="form-control" 
          />
        </div>
      ))}
    </div>
  );
};

export default FieldConfigurator;