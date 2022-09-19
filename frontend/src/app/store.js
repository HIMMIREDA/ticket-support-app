import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import ticketReducer from "../features/ticket/ticketSlice";

const store = configureStore({
  reducer: { 
    auth: authReducer,
    ticket: ticketReducer
},
});

export default store;
