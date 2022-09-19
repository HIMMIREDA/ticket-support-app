import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import noteService from "./noteService";

// Get Notes
export const getNotes = createAsyncThunk(
  "note/getAll",
  async (ticketId, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const notes = await noteService.getNotes(ticketId, token);
      return notes;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// add note
export const createNote = createAsyncThunk(
  "note/create",
  async ({ ticketId, noteText }, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      return await noteService.createNote(noteText, ticketId, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  notes: [],
  loading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
        state.notes = [];
        state.message = action.payload;
      })
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
        state.notes.push(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
        state.notes = [];
        state.message = action.payload;
      });
  },
});

export const { reset } = noteSlice.actions;

export default noteSlice.reducer;
