import { SHOW, HIDE, Action } from "actions/types"

const init = {
  open: false as boolean,
  data: {
    add: {
      key: "add",
      header: "Add new parametres"
    },
    edit: {
      key: "edit",
      header: "Edit parametres"
    }
  },
  modal_state: "add" as ProfileMenuModalState
}

export function profile_menu_modal_reducer(state = init, action: Action): typeof init {
  switch (action.type) {
    case SHOW.MODAL.PARAMETRES:
      if (action.payload !== "delete") {
        return { ...state, open: true, modal_state: action.payload }
      } else {
        return { ...state, open: false }
      }
    case HIDE.MODAL.PARAMETRES:
      return { ...state, open: false }
    default:
      return state;
  }
}

export type ProfileMenuModalState = "add" | "edit"