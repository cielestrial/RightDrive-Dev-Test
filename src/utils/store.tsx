import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { myAlertsReducer } from "./myAlerts";
import { myCardsReducer } from "./myCards";
import { myPagesReducer } from "./myPages";

const store = configureStore({
  reducer: {
    myPages: myPagesReducer,
    myCards: myCardsReducer,
    myAlerts: myAlertsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
