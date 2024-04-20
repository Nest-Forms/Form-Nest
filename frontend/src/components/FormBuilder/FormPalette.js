import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import './FormBuilder.css';

const FormPalette = () => {
  const items = [
    { id: 'text', content: 'Text Input' },
    { id: 'number', content: 'Number Input' },
    { id: 'checkbox', content: 'Checkbox' },
    { id: 'radio', content: 'Radio Button' },
    { id: 'select', content: 'Select Input' }
  ];

  return (
    <Droppable droppableId="palette" isDropDisabled={true}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="palette"
        >
          {items.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="draggable-item"
                >
                  {item.content}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default FormPalette;
