import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const myPages = createSlice({
  name: "pageIndex",
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

export const myPagesActions = myPages.actions;
export const myPagesReducer = myPages.reducer;
