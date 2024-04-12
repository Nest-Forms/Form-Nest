// FieldPropertiesModal.js
import React, { useState } from 'react';

const FieldPropertiesModal = ({ isOpen, onClose, onSave, fieldProps, fieldType }) => {
  const [localProps, setLocalProps] = useState(fieldProps);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalProps({ ...localProps, [name]: value });
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: '20%', left: '30%', backgroundColor: 'white', padding: '20px', border: '1px solid #ccc', zIndex: 1000 }}>
      <h2>Field Properties</h2>
      {/* Common field */}
      <label>
        Label:
        <input name="label" value={localProps.label || ''} onChange={handleChange} />
      </label>
      {/* Specific to 'text' type fields */}
      {fieldType === 'text' && (
        <label>
          Placeholder:
          <input name="placeholder" value={localProps.placeholder || ''} onChange={handleChange} />
        </label>
      )}
      {/* Specific to 'select' type fields */}
      {fieldType === 'select' && (
        <label>
          Options (comma-separated):
          <input name="options" value={localProps.options || ''} onChange={handleChange} />
        </label>
      )}
      <button onClick={() => onSave(localProps)}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default FieldPropertiesModal;
