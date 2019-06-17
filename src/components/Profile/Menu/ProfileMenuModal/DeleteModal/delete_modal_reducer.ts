import { SHOW, HIDE, Action } from "actions/types"

const init = {
  open: false as boolean,
  data: {
    delete: {
      key: "delete",
      header: "Delete parameters"
    }
  },
} as const

export function delete_modal_reducer(state = init, action: Action): typeof init {
  switch (action.type) {
    case SHOW.MODAL.PARAMETRES:
      if (action.payload === "delete") {
        return { ...state, open: true }
      } else {
        return { ...state, open: false }
      }
    case HIDE.MODAL.PARAMETRES:
      return { ...state, open: false }
    default:
      return state;
  }
}
