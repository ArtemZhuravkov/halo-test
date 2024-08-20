import { createSlice } from "@reduxjs/toolkit";

const LS_SCORE_KEY = "scoreboard";
const initialState = {
  items: JSON.parse(localStorage.getItem(LS_SCORE_KEY) || "[]"),
};

export const localStorageSlice = createSlice({
  name: "localStorage",
  initialState,
  reducers: {
    addResultToScoreboard(state, action) {
      state.items.push(action.payload);
      localStorage.setItem(LS_SCORE_KEY, JSON.stringify(state.items));
    },
  },
});

export const localStorageActions = localStorageSlice.actions;
export const localStorageReducer = localStorageSlice.reducer;