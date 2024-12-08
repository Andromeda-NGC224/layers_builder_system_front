export const selectAllDiagrams = (state) =>
  Object.values(state.diagrams.diagrams);
export const selectActiveDiagram = (state) =>
  state.diagrams.diagrams[state.diagrams.activeDiagramId];
export const selectLoadingState = (state) => state.diagrams.loading;
export const selectIsLoading = (state) => state.diagrams.loading;
export const selectError = (state) => state.diagrams.error;
