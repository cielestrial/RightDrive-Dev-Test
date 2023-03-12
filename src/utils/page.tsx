import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const pageIndex = createSlice({
  name: "index",
  initialState: {
    index: 1,
  },
  reducers: {
    setIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    },
  },
});

export const actions = pageIndex.actions;
export const reducer = pageIndex.reducer;
