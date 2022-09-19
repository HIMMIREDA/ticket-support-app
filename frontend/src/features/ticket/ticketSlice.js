import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ticketService from "./ticketService";

const initialState = {
  tickets: [],
  ticket: {},
  loading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// create ticket
export const createTicket = createAsyncThunk(
  "tickets/create",
  async (ticketData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      await ticketService.createTicket(ticketData, token);
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

// get tickets
export const getTickets = createAsyncThunk(
  "tickets/getAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const tickets = await ticketService.getTickets(token);
      return tickets;
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

// get a signle ticket
export const getTicket = createAsyncThunk(
  "tickets/get",
  async (ticketId, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const ticket = await ticketService.getTicket(ticketId, token);
      return ticket;
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

// update ticket status to closed
export const closeTicket = createAsyncThunk(
  "tickets/close",
  async (ticketId, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const ticket = await ticketService.closeTicket(ticketId, token);
      return ticket;
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

const ticketSlice = createSlice({
  name: "tickets",
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
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(createTicket.fulfilled, (state) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload;
      })
      .addCase(getTickets.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
        state.tickets = action.payload;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
        state.tickets = [];
        state.message = action.payload;
      })
      .addCase(getTicket.pending, (state) => {
        state.loading = true;
        state.isSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
        state.ticket = action.payload;
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.loading = false;
        state.isError = false;
        state.isSuccess = true;
        state.ticket = {};
        state.message = action.payload;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.map((ticket) =>
          ticket._id === action.payload._id
            ? (ticket.status = "closed")
            : ticket
        );
        
        state.message = action.payload;
      });
  },
});

export const { reset } = ticketSlice.actions;

export default ticketSlice.reducer;
