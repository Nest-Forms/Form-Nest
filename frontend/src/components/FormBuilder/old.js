import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Formik, Form, Field } from 'formik';
import './FormBuilder.css'; 

import { TextInput, NumberInput, RadioButton, SelectInput, CheckboxInput } from '../FormInputs';

// Adjusting initialFormItems and availableComponents to use fixed IDs
const initialFormItems = [];

const availableComponents = [
  { id: 'text-1', type: 'text', label: 'Text Input', placeholder: 'Placeholder', name: 'textField-1' },
  { id: 'checkbox-1', type: 'checkbox', label: 'Checkbox', name: 'checkboxField-1' },
  { id: 'number-1', type: 'number', label: 'Number Input', placeholder: 'Enter a number', name: 'numberField-1' },
  { id: 'radio-1', type: 'radio', label: 'Radio Button', options: [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }], name: 'radioField-1' },
  { id: 'select-1', type: 'select', label: 'Select Dropdown', options: [{ label: 'Option A', value: 'A' }, { label: 'Option B', value: 'B' }], name: 'selectField-1' }
];

const componentMap = {
  text: TextInput,
  checkbox: CheckboxInput,
  number: NumberInput,
  radio: RadioButton,
  select: SelectInput,
};

const FormBuilder = () => {
  const [formItems, setFormItems] = useState(initialFormItems);

  const onDragEnd = useCallback((result) => {
    const { source, destination } = result;
  
    if (!destination) return;
  
    if (source.droppableId === "availableComponents" && destination.droppableId === "formBuilderDroppable") {
      const itemToAdd = availableComponents.find(item => item.id === result.draggableId);
  
      if (!itemToAdd) return;
  
      // Directly use the item without changing its ID or name
      const newItem = { ...itemToAdd };

      setFormItems(currentItems => [...currentItems, newItem]);
    }
  }, [formItems]);

  // Simplifying initialValues generation based on fixed item names
  const initialValues = formItems.reduce((acc, item) => ({
    ...acc,
    [item.name]: '',
  }), {});

  return (
    <Formik initialValues={initialValues} onSubmit={(values) => console.log(values)}>
      {() => (
        <Form>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="form-builder-container">
              <Droppable droppableId="availableComponents" isDropDisabled={true}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="palette-section">
                    <h4>Available Components</h4>
                    {availableComponents.map((item, index) => (
                      // Using item.id for key and draggableId
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="draggable-item">
                            {item.label}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
              </Droppable>
              <Droppable droppableId="formBuilderDroppable">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="form-area">
                    <h4>Form Area</h4>
                    {formItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="draggable-item">
                            <Field name={item.name} as={componentMap[item.type]} {...item} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </DragDropContext>
          <button type="submit">Submit Form</button>
        </Form>
      )}
    </Formik>
  );
};

export default FormBuilder;
