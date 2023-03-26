import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { coin, priceDetails } from "../api/coinApi";

export const myCards = createSlice({
  name: "coins",
  initialState: {
    index: 0,
    loadCounter: 0,
    coins: Object.create(null) as { [rank: number]: coin },
  },
  reducers: {
    setCoins: (state, action: PayloadAction<coin[]>) => {
      if (action.payload.length > 0)
        state.coins = action.payload.reduce(
          (coins, coin) => ({
            ...coins,
            [coin.rank]: coin,
          }),
          {}
        );
    },
    setLogo: (state, action: PayloadAction<{ rank: number; url: string }>) => {
      state.coins[action.payload.rank].logo = action.payload.url;
    },
    setPriceDetails: (
      state,
      action: PayloadAction<{ rank: number; priceDetails: priceDetails }>
    ) => {
      state.coins[action.payload.rank].priceDetails =
        action.payload.priceDetails;
    },
    setIndex: (state, action: PayloadAction<number>) => {
      state.index = action.payload;
    },
    incrementLoadCounter: (state) => {
      state.loadCounter += 4;
    },
  },
});

export const myCardsActions = myCards.actions;
export const myCardsReducer = myCards.reducer;
