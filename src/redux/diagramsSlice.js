import { createSlice } from "@reduxjs/toolkit";
import { createDiagram, fetchOneDiagram } from "./operations.js";

const initialState = {
  diagrams: [],
  loading: false,
  error: null,
};

const diagramsSlice = createSlice({
  name: "diagrams",
  initialState,
  reducers: {
    resetDiagrams: (state) => {
      state.diagrams = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOneDiagram.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOneDiagram.fulfilled, (state, action) => {
        state.loading = false;
        state.diagrams = action.payload;
      })
      .addCase(fetchOneDiagram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createDiagram.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDiagram.fulfilled, (state, action) => {
        state.loading = false;
        state.diagrams = action.payload;
      })
      .addCase(createDiagram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetDiagrams } = diagramsSlice.actions;
export default diagramsSlice.reducer;
