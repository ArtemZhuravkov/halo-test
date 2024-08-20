import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { localStorageActions } from "../store/local-storage/localStorage.slice";
import { playerFormModalActions } from "../store/player-form-modal/playerFormModal.slice";
import { playerDataActions } from "../store/player-data/playerData.slice";
import { gameStateActions } from "../store/game-state/gameState.slice";

const actions = {
    ...localStorageActions,
    ...playerFormModalActions,
    ...playerDataActions,
    ...gameStateActions
}
export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
