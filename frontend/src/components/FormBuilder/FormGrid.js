import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import FieldRenderer from './FieldRenderer';
import './FormBuilder.css'; // Make sure the path is correct

const FormGrid = () => {
  const [components, setComponents] = useState([]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const items = Array.from(components);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    setComponents(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="form-grid">
        {(provided) => (
          <div 
            ref={provided.innerRef} 
            {...provided.droppableProps}
            className="form-grid" // This applies the CSS styling
          >
            {components.map((item, index) => (
              <FieldRenderer key={item.id} field={item} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default FormGrid;
