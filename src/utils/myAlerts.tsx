import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const myAlerts = createSlice({
  name: "alerts",
  initialState: {
    open: false,
    alertMessage: "",
  },
  reducers: {
    close: (state) => {
      if (state.open) state.open = false;
    },
    open: (state) => {
      if (!state.open) state.open = true;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.alertMessage = action.payload;
    },
  },
});

export const myAlertsActions = myAlerts.actions;
export const myAlertsReducer = myAlerts.reducer;
