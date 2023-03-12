import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { reducer } from "./page";

const store = configureStore({
  reducer: {
    pageIndex: reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
