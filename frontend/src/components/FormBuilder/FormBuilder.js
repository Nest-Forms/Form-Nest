// FormBuilder.js
import React, { useState } from 'react';
import { useFormik, FormikProvider } from 'formik';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Responsive, WidthProvider } from 'react-grid-layout';
import FormPalette, { paletteFields } from './FormPalette';
import FieldRenderer from './FieldRenderer';
import FieldConfigurator from './FieldConfigurator';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { v4 as uuidv4 } from 'uuid';
const ResponsiveGridLayout = WidthProvider(Responsive);

const FormBuilder = () => {
  const [selectedField, setSelectedField] = useState(null);
  const [layout, setLayout] = useState([]);
  const [formState, setFormState] = useState([]);

  const initialValues = formState.reduce((values, field) => {
    values[field.id] = '';
    return values;
  }, {});

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      console.log(values); 
    },
  });

  const handleDragEnd = (result) => {
    const { source, destination } = result;
  
    // dropped outside the list
    if (!destination) {
      return;
    }
  
    // If the item was dropped in the same place, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
  
    // If the item was dropped from the palette to the form, add it to the formState
    if (source.droppableId === 'palette' && destination.droppableId === 'form') {
      const newFieldId = uuidv4();
      setFormState(prevFormState => {
        const newFormState = Array.from(prevFormState);
        const field = { ...paletteFields.find(field => field.id === result.draggableId), id: newFieldId }
        newFormState.splice(destination.index, 0, field);
        return newFormState;
      });
    
      setLayout(prevLayout => {
        const newLayout = Array.from(prevLayout);
        newLayout.splice(destination.index, 0, {i: newFieldId, x: 0, y: Infinity, w: 1, h: 1});
        return newLayout;
      });
    }
  
    // Otherwise, we need to update the formState and layout with the new item position
    setFormState(prevFormState => {
      const newFormState = Array.from(prevFormState);
      const [removed] = newFormState.splice(source.index, 1);
      newFormState.splice(destination.index, 0, removed);
      return newFormState;
    });
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="container">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="row">
            <div className="col-4">
              {selectedField ? (
                <FieldConfigurator field={selectedField} setSelectedField={setSelectedField} />
              ) : (
                <Droppable droppableId="palette">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <FormPalette />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </div>
            <div className="col-8">
              <Droppable droppableId="form">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <ResponsiveGridLayout className="layout" onLayoutChange={handleLayoutChange} cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }} rowHeight={30}>
                      {formState.map((field) => (
                        <div key={field.id} data-grid={layout ? layout.find(l => l.i === field.id) : undefined}>
                          <FieldRenderer field={field} formik={formik} setSelectedField={setSelectedField} />
                        </div>
                      ))}
                    </ResponsiveGridLayout>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </DragDropContext>
        <button type="submit" className="btn btn-primary mt-3">Submit</button>
      </form>
    </FormikProvider>
  );
};

export default FormBuilder;