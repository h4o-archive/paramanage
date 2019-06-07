import { FETCH, SELECT, START, END, SET, action } from "actions/types"

type data = {
  "id": string,
  "order": string,
  "key": string
}
const init = {
  platforms: {
    data: {} as data,
    selected: "0",
    previous_selected: "0"
  },
  versions: {
    data: {} as data,
    selected: "0",
    previous_selected: "0"
  },
  environments: {
    data: {} as data,
    selected: "0",
    previous_selected: "0"
  },
  loading: false
}

export function metadatas_reducer(state = init, action: action) {
  switch (action.type) {
    case FETCH.PLATFORMS:
      return { ...state, platforms: { ...state.platforms, data: action.payload, selected: "0" } }
    case SELECT.PLATFORM:
      return { ...state, platforms: { ...state.platforms, selected: action.payload } }
    case FETCH.VERSIONS:
      return { ...state, versions: { ...state.versions, data: action.payload, selected: "0" } }
    case SELECT.VERSION:
      return { ...state, versions: { ...state.versions, selected: action.payload } }
    case FETCH.ENVIRONMENTS:
      return { ...state, environments: { ...state.environments, data: action.payload, selected: "0" } }
    case SELECT.ENVIRONMENT:
      return { ...state, environments: { ...state.environments, selected: action.payload } }
    case START.LOADING:
      return { ...state, loading: true }
    case END.LOADING:
      return { ...state, loading: false }
    case SET.PREVIOUS_SELECTED:
      return {
        ...state,
        platforms: { ...state.platforms, selected: "0", previous_selected: state.platforms.selected },
        versions: { ...state.versions, selected: "0", previous_selected: state.versions.selected },
        environments: { ...state.environments, selected: "0", previous_selected: state.environments.selected }
      }
    default:
      return state;
  }
}