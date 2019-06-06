import { START, END, action, RESET } from "actions/types"

type loader_reducer_state = { [key: string]: boolean } | {}
const init: loader_reducer_state = {}

function loader_reducer(state = init, action: action): loader_reducer_state {
  switch (action.type) {
    case START.REQUEST:
      return { ...state, [action.payload]: true }
    case END.REQUEST:
      return { ...state, [action.payload]: false }
    case RESET.REQUEST_STATUS:
      return {}
    default:
      return state
  }
}