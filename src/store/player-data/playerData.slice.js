import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  complexity: null,
  id: "",
  token: "",
};

export const playerDataSlice = createSlice({
  name: "playerData",
  initialState,
  reducers: {
    setPlayerData(state, { payload }) {
      return { ...state, ...payload };
    },
  },
});

export const playerDataActions = playerDataSlice.actions;
export const playerDataReducer = playerDataSlice.reducer;
