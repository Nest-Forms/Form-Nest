import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import FormPalette from './FormPalette';
import FormGrid from './FormGrid';
import './FormBuilder.css';

const FormBuilder = () => {
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    console.log('Implement item reordering or moving logic here');
    };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="form-builder">
        <FormPalette />
        <FormGrid />
      </div>
    </DragDropContext>
  );
};

export default FormBuilder;
