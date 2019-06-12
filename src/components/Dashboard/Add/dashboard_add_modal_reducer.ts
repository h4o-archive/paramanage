import { SHOW, HIDE, Action } from "actions/types"

const init = {
  open: false as boolean,
  data: {
    version: {
      key: "version",
      header: "Add new version",
      description_header: "How would you like to create a new version ?",
      shouldDisplay: (platforms_is_empty: boolean) => !platforms_is_empty
    },
    environment: {
      key: "environment",
      header: "Add new environment",
      description_header: "How would you like to create a new environment ?",
      shouldDisplay: undefined
    },
    platform: {
      key: "platform",
      header: "Add new platform",
      description_header: "How would you like to create a new platform ?",
      shouldDisplay: undefined
    }
  },
  modal_state: "version" as ModalState
} as const

export function dashboard_add_modal_reducer(state = init, action: Action): typeof init {
  switch (action.type) {
    case SHOW.MODAL.DASHBOARD_ADDING:
      return { ...state, open: true, modal_state: action.payload }
    case HIDE.MODAL.DASHBOARD_ADDING:
      return { ...state, open: false }
    default:
      return state;
  }
}

export type ModalState = "version" | "environment" | "platform"