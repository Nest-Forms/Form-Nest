import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

const FieldConfigurator = ({ field, setSelectedField }) => {
  const handleBack = () => {
    setSelectedField(null);
  };

  return (
    <div className="border p-2">
      <button onClick={handleBack} className="btn btn-secondary mb-2">Back</button>
      <h5>Configure {field.type}</h5>
      {/* Add form inputs here for configuring the field */}
    </div>
  );
};

export default FieldConfigurator;