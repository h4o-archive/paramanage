import { START, FULLFILL, REJECT, RESET, QUEUE, Action } from "actions/types"
import { _ } from "utils"
import * as Types from "utils/Types"

const init = {
  requests: {} as {
    readonly [key: string]: Readonly<{
      status: "START" | "REJECT",
      method: string,
      url: string,
      id: string,
      params: Readonly<Types.OverloadObject<string>>,
      json: Readonly<Types.OverloadObject<string>>,
      api_call_id: string
    }>
  },
  outdated_requests: {} as {
    readonly [key: string]: string
  }
} as const

export function loader_reducer(state = init, action: Action): typeof init {
  switch (action.type) {
    case START.REQUEST:
      return { ...state, requests: { ...state.requests, ...{ [action.payload.api_call_id]: { status: "START", ...action.payload } } } }
    case FULLFILL.REQUEST:
      return { ...state, requests: _.omit(state.requests, [action.payload]) }
    case REJECT.REQUEST:
      return { ...state, requests: { ...state.requests, [action.payload]: { ...state.requests[action.payload], status: "REJECT" } } }
    case QUEUE.OUTDATED_REQUEST:
      return { ...state, outdated_requests: { ...state.outdated_requests, [action.payload]: true } }
    case RESET.OUTDATED_REQUEST:
      return { ...state, outdated_requests: {} }
    case RESET.REQUEST_STATUS:
      return init
    default:
      return state
  }
}