import { configureStore } from "@reduxjs/toolkit";
import { localStorageReducer } from "./local-storage/localStorage.slice";
import { playerFormModalReducer } from "./player-form-modal/playerFormModal.slice";
import { caveDroneServerApi } from "./api/cave-drone-server/cave-drone-server.api";
import { playerDataReducer } from "./player-data/playerData.slice";
import { gameStateReducer } from "./game-state/gameState.slice";

export const store = configureStore({
  reducer: {
    [caveDroneServerApi.reducerPath]: caveDroneServerApi.reducer,
    localStorage: localStorageReducer,
    playerFormModal: playerFormModalReducer,
    playerData: playerDataReducer,
    gameIsOverState: gameStateReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(caveDroneServerApi.middleware),
});
