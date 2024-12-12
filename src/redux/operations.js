import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const diagramsApiUrl = "https://layers-builder-system-backend.onrender.com/api";

// http://localhost:3000/api

export const fetchAllDiagrams = createAsyncThunk(
  "diagrams/fetchAllDiagrams",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${diagramsApiUrl}/diagrams`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createDiagram = createAsyncThunk(
  "diagrams/createDiagrams",
  async (diagramData, thunkAPI) => {
    try {
      console.log(diagramData);

      const response = await axios.post(
        `${diagramsApiUrl}/diagrams`,
        diagramData
      );
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return thunkAPI.rejectWithValue("Diagram was not created");
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchOneDiagram = createAsyncThunk(
  "diagrams/fetchOneDiagram",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${diagramsApiUrl}/diagrams/${id}`);

      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return thunkAPI.rejectWithValue("Diagram was not found");
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateDiagram = createAsyncThunk(
  "diagrams/updateDiagram",
  async ({ id, diagramData }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${diagramsApiUrl}/diagrams/${id}`,
        diagramData
      );
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return thunkAPI.rejectWithValue("Diagram was not updated");
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
