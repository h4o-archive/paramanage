import { action } from "actions/types"

export function dispatchAction(type: string, payload: any): action {
  return {
    type,
    payload
  }
}