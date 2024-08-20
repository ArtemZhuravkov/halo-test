import { createSlice } from "@reduxjs/toolkit";

const initialState = { isOpen: false };

export const playerFormModalSlice = createSlice({
  name: "playerFormModal",
  initialState,
  reducers: {
    openModal(state) {
      state.isOpen = true;
    },
    closeModal(state) {
      state.isOpen = false;
    },
  },
});

export const playerFormModalActions = playerFormModalSlice.actions;
export const playerFormModalReducer = playerFormModalSlice.reducer;
