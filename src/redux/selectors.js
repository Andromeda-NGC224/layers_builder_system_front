import { createSelector } from "reselect";

export const selectDiagramsState = (state) => state.diagrams;

export const selectAllDiagrams = createSelector(
  [selectDiagramsState],
  (diagramsState) => Object.values(diagramsState.diagrams)
);

export const selectActiveDiagram = (state) =>
  state.diagrams.diagrams[state.diagrams.activeDiagramId];
export const selectLoadingState = (state) => state.diagrams.loading;
export const selectIsLoading = (state) => state.diagrams.loading;
export const selectError = (state) => state.diagrams.error;
