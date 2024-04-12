import React, { useState, useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Formik, Form } from 'formik';
import FormInputPalette from './FormInputPalette';
import FormGrid from './FormGrid';
import FieldPropertiesModal from './FieldPropertiesModal'; // Make sure this component is ready to use
import './FormBuilder.css';
import { TextInput, NumberInput, RadioButton, SelectInput, CheckboxInput } from '../FormInputs';

// Your componentMap remains as you've defined it
const componentMap = {
  text: TextInput,
  checkbox: CheckboxInput,
  number: NumberInput,
  radio: RadioButton,
  select: SelectInput,
};

// Define the available components for the FormInputPalette
const availableComponents = [
  { type: 'text', label: 'Text Input' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'number', label: 'Number Input' },
  { type: 'radio', label: 'Radio Button' },
  { type: 'select', label: 'Select Dropdown' },
];

const FormBuilder = () => {
  const [formItems, setFormItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFieldType, setCurrentFieldType] = useState('');
  const [fieldConfig, setFieldConfig] = useState({});

  const onAddItem = useCallback((type) => {
    setCurrentFieldType(type);
    setFieldConfig({}); // Reset field configuration
    setIsModalOpen(true);
  }, []);

  const handleSaveFieldProps = useCallback((fieldProps) => {
    const newItem = {
      id: `item-${formItems.length}-${Date.now()}`, // Ensure unique IDs
      type: currentFieldType,
      props: fieldProps, // Store the configured props
    };
    setFormItems(prevItems => [...prevItems, newItem]);
    setIsModalOpen(false);
  }, [formItems, currentFieldType]);

  const onDragEnd = useCallback((result) => {
    const { destination, source } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    const items = Array.from(formItems);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    setFormItems(items);
  }, [formItems]);

  // Prepare initialValues for Formik based on formItems
  const initialValues = formItems.reduce((acc, item) => ({
    ...acc,
    [item.id]: '', // Adjust this based on your specific needs
  }), {});

  return (
    <div className="form-builder-container">
      <Formik initialValues={initialValues} onSubmit={values => console.log(values)}>
        <Form>
          <DragDropContext onDragEnd={onDragEnd}>
            <FormInputPalette availableComponents={availableComponents} onAddItem={onAddItem} />
            <FormGrid formItems={formItems} componentMap={componentMap} />
          </DragDropContext>
          <button type="submit">Submit Form</button>
        </Form>
      </Formik>
      <FieldPropertiesModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveFieldProps} 
        fieldConfig={fieldConfig}
        fieldType={currentFieldType}
      />
    </div>
  );
};

export default FormBuilder;
