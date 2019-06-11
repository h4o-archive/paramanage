import { Action } from "actions/types"

export function dispatchAction(type: string, payload?: any): Action {
  return {
    type,
    payload
  }
}