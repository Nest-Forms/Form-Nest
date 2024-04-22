import { createSlice } from '@reduxjs/toolkit';

const formSlice = createSlice({
  name: 'form',
  initialState: { fields: [] },
  reducers: {
    addField: (state, action) => {
      state.fields.push(action.payload);
    },
    removeField: (state, action) => {
      state.fields = state.fields.filter(field => field.id !== action.payload);
    },
    updateField: (state, action) => {
      const index = state.fields.findIndex(field => field.id === action.payload.id);
      if (index !== -1) {
        state.fields[index] = action.payload;
      }
    },
  },
});

export const { addField, removeField, updateField } = formSlice.actions;

export default formSlice.reducer;