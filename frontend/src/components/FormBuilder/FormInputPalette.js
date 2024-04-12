import React from 'react';
import './FormBuilder.css';

const FormInputPalette = ({ availableComponents, onAddItem }) => {
  return (
    <div className="palette-section">
      {availableComponents.map((item) => (
        <div key={item.id} className="draggable-item" onClick={() => onAddItem(item.type)}>
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default FormInputPalette;
