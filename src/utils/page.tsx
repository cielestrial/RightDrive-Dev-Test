import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const page = createSlice({
  name: "index",
  initialState: {
    index: 1,
    pageTurnEffect: true,
  },
  reducers: {
    incrementIndex: (state) => {
      if (state.index < 10) state.index++;
    },
    decrementIndex: (state) => {
      if (state.index > 1) state.index--;
    },
    setIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    },
    enablePageTurnEffect: (state) => {
      if (!state.pageTurnEffect) state.pageTurnEffect = true;
    },
    disablePageTurnEffect: (state) => {
      if (state.pageTurnEffect) state.pageTurnEffect = false;
    },
  },
});

export const pageActions = page.actions;
export const pageReducer = page.reducer;
