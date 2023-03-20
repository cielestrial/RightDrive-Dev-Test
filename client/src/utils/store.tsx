import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { myCardsReducer } from "./myCards";
import { pageReducer } from "./page";

const store = configureStore({
  reducer: {
    page: pageReducer,
    myCards: myCardsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
