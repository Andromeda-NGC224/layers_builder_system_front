import { createSlice } from "@reduxjs/toolkit";
import {
  createDiagram,
  fetchAllDiagrams,
  fetchOneDiagram,
  updateDiagram,
} from "./operations.js";

const initialState = {
  diagrams: [],
  activeDiagramId: null,
  loading: false,
  error: null,
  totalItems: 0,
};

const diagramsSlice = createSlice({
  name: "diagrams",
  initialState,
  reducers: {
    resetDiagrams: (state) => {
      state.diagrams = [];
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
      const index = state.diagrams.findIndex((diagram) => diagram.id === id);
      if (index !== -1) {
        state.diagrams[index] = {
          ...state.diagrams[index],
          blocks,
          connections,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDiagrams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllDiagrams.fulfilled, (state, action) => {
        state.loading = false;
        state.diagrams = [...state.diagrams, ...action.payload.data.diagrams];
        state.totalItems = action.payload.data.totalItems;
      })
      .addCase(fetchAllDiagrams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOneDiagram.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOneDiagram.fulfilled, (state, action) => {
        state.loading = false;
        state.diagrams = [action.payload];
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
        state.diagrams.push(action.payload);
      })
      .addCase(createDiagram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateDiagram.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDiagram.fulfilled, (state, action) => {
        state.loading = false;
        const updatedDiagram = action.payload;
        state.diagrams = state.diagrams.map((diagram) =>
          diagram._id === updatedDiagram._id ? updatedDiagram : diagram
        );
      })
      .addCase(updateDiagram.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetDiagrams, addDiagram, setActiveDiagram } =
  diagramsSlice.actions;
export default diagramsSlice.reducer;
