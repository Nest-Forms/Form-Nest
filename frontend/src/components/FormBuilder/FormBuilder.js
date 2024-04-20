// FormBuilder.js
import React, { useState } from 'react';
import { useFormik, FormikProvider } from 'formik';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Responsive, WidthProvider } from 'react-grid-layout';
import FormPalette from './FormPalette';
import FieldRenderer from './FieldRenderer';
import FieldConfigurator from './FieldConfigurator';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const FormBuilder = () => {
  const [selectedField, setSelectedField] = useState(null);
  const [layout, setLayout] = useState([]);
  
  const formState = [
    { id: '1', type: 'text', label: 'Text Input' },
    // add more form elements here
  ];

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
  
    // Otherwise, we need to update the layout state with the new item position
    setLayout(prevLayout => {
      const newLayout = [...prevLayout];
      const [removed] = newLayout.splice(source.index, 1);
      newLayout.splice(destination.index, 0, removed);
      return newLayout;
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
                <FormPalette />
              )}
            </div>
            <div className="col-8">
              <Droppable droppableId="droppable">
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