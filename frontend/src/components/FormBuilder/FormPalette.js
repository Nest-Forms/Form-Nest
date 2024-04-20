// FormPalette.js
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const paletteFields = [
  { id: 'text', type: 'text', label: 'Text Input' },
  { id: 'number', type: 'number', label: 'Number Input' },
  { id: 'checkbox', type: 'checkbox', label: 'Checkbox Input' },
  { id: 'radio', type: 'radio', label: 'Radio Input' },
  // Add more field types as needed
];

const FormPalette = () => {
  return (
    <div>
      {paletteFields.map((field, index) => (
        <Draggable key={field.id} draggableId={field.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {field.label}
            </div>
          )}
        </Draggable>
      ))}
    </div>
  );
};

export { paletteFields };
export default FormPalette;