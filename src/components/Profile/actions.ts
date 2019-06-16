import { ACTIVE, DEACTIVE, Action } from "actions/types"

export function toggleSelectMode(mode: boolean): Action {
  return {
    type: mode ? ACTIVE.SELECT_MODE : DEACTIVE.SELECT_MODE
  }
}