import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { c } from "vite/dist/node/types.d-aGj9QkWt";

const diagramsApiUrl = "123";


export const createDiagram = createAsyncThunk(
    "diagrams/createDiagrams",
    async (diagramData, thunkAPI) => {
      try {
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

  export const fetchOneDiagram = createAsyncThunk("diagrams/fetchOneDiagram",
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
    });