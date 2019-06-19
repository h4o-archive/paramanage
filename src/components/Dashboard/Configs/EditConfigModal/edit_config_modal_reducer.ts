import { SHOW, HIDE, Action } from "actions/types"
import { ConfigState } from "../configs_reducer";


const init = {
  open: false as boolean,
  header: "Paramanaging..." as string,
  config: {} as ConfigEditing
} as const

export function edit_config_modal_reducer(state = init, action: Action): typeof init {
  switch (action.type) {
    case SHOW.MODAL.EDIT_CONFIG:
      return { ...state, open: true, header: action.payload.label, config: action.payload.config }
    case HIDE.MODAL.EDIT_CONFIG:
      return { ...state, open: false }
    default:
      return state;
  }
}

export type ConfigEditing = ConfigState & { next: ConfigEditing }