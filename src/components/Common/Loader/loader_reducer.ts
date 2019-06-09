import { START, FULLFILL, REJECT, RESET, QUEUE, action } from "actions/types"
import { _ } from "utils"

type loader_reducer_state = {
  readonly requests: {
    readonly [key: string]: {
      readonly status: "START" | "REJECT",
      readonly params: string[]
    }
  },
  readonly outdated_requests: {
    readonly [key: string]: string
  }
}
const init: loader_reducer_state = { requests: {}, outdated_requests: {} }

export function loader_reducer(state = init, action: action): loader_reducer_state {
  switch (action.type) {
    case START.REQUEST:
      return { ...state, requests: { ...state.requests, ...{ [action.payload.id]: { status: "START", params: action.payload.params } } } }
    case FULLFILL.REQUEST:
      return { ...state, requests: _.omit(state.requests, [action.payload]) }
    case REJECT.REQUEST:
      return { ...state, requests: { ...state.requests, [action.payload]: { ...state.requests[action.payload], status: "REJECT" } } }
    case QUEUE.OUTDATED_REQUEST:
      return { ...state, outdated_requests: { ...state.outdated_requests, ...action.payload } }
    case RESET.OUTDATED_REQUEST:
      return { ...state, outdated_requests: {} }
    case RESET.REQUEST_STATUS:
      return init
    default:
      return state
  }
}