import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import diagramsReducer from "./diagramsSlice.js";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["diagrams"],
};

const persistedDiagramsReducer = persistReducer(
  persistConfig,
  diagramsReducer
);

export const store = configureStore({
  reducer: {
    diagrams: persistedDiagramsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);