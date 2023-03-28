import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { coin } from "../api/coinApiCS";

export const myCards = createSlice({
  name: "cards",
  initialState: {
    index: 0,
    loadStatus: false,
    coins: Object.create(null) as { [rank: number]: coin },
    currency: "cad",
  },
  reducers: {
    setCoins: (state, action: PayloadAction<coin[]>) => {
      if (action.payload.length > 0) {
        state.coins = action.payload.reduce(
          (coins, coin) => ({
            ...coins,
            [coin.market_cap_rank]: coin,
          }),
          {}
        );
        state.loadStatus = true;
      }
    },
    setIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
  },
});

export const myCardsActions = myCards.actions;
export const myCardsReducer = myCards.reducer;
