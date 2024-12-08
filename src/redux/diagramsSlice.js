import { createSlice } from "@reduxjs/toolkit";
import { createDiagram, fetchOneDiagram } from "./operations.js";

const initialState = {
  diagrams: {},
  activeDiagramId: null,
  loading: false,
  error: null,
};

const diagramsSlice = createSlice({
  name: "diagrams",
  initialState,
  reducers: {
    resetDiagrams: (state) => {
      state.diagrams = {};
      state.activeDiagramId = null;
    },
    addDiagram: (state, action) => {
      const newDiagram = action.payload;
      state.diagrams[newDiagram.id] = newDiagram;
    },
    setActiveDiagram: (state, action) => {
      state.activeDiagramId = action.payload;
    },
    updateDiagram: (state, action) => {
      const { id, blocks, connections } = action.payload;
      if (state.diagrams[id]) {
        state.diagrams[id].blocks = blocks;
        state.diagrams[id].connections = connections;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOneDiagram.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOneDiagram.fulfilled, (state, action) => {
        state.loading = false;
        state.diagrams[action.payload.id] = action.payload;
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
        const newDiagram = action.payload;
        state.diagrams[newDiagram.id] = newDiagram;
      })
      .addCase(createDiagram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetDiagrams, addDiagram, setActiveDiagram, updateDiagram } =
  diagramsSlice.actions;
export default diagramsSlice.reducer;
