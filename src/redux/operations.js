import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const diagramsApiUrl = "https://layers-builder-system-backend.onrender.com/api";
const diagramsApiUrlHost = "http://localhost:3000/api";

export const fetchAllDiagrams = createAsyncThunk(
  "diagrams/fetchAllDiagrams",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${diagramsApiUrlHost}/diagrams`);

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
        `${diagramsApiUrlHost}/diagrams`,
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
      const response = await axios.get(`${diagramsApiUrlHost}/diagrams/${id}`);
      console.log(response.data.data);

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
    console.log(diagramData);
    console.log(id);

    try {
      const response = await axios.patch(
        `${diagramsApiUrlHost}/diagrams/${id}`,
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
