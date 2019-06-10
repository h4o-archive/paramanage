import { START, FULLFILL, REJECT, RESET, QUEUE, Action } from "actions/types"
import { _ } from "utils"

type LoaderState = {
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

const init: LoaderState = { requests: {}, outdated_requests: {} }

export function loader_reducer(state = init, action: Action): LoaderState {
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