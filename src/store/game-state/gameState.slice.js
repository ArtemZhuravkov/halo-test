import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isGameOver: true,
};

export const gameStateSlice = createSlice({
  name: "gameIsOverState",
  initialState,
  reducers: {
    setIsGameOver(state, {payload}) {
      state.isGameOver = payload;
    },
  },
});

export const gameStateActions = gameStateSlice.actions;
export const gameStateReducer = gameStateSlice.reducer;
