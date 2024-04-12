import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Field } from 'formik';

const FormGrid = ({ formItems, componentMap }) => {
  return (
    <Droppable droppableId="formGrid">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="form-grid">
          {formItems.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="grid-item"
                >
                  <Field component={componentMap[item.type]} name={item.id} />
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

export default FormGrid;
