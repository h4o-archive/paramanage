import { FETCH, SELECT, SET, Action } from "actions/types"

type Data = {
  readonly "id": string,
  readonly "order": string,
  readonly "key": string
}
type MetadatasState = {
  readonly platforms: {
    readonly data: Data,
    readonly selected: string,
    readonly previous_selected: string
  },
  readonly versions: {
    readonly data: Data,
    readonly selected: string,
    readonly previous_selected: string
  },
  readonly environments: {
    readonly data: Data,
    readonly selected: string,
    readonly previous_selected: string
  }
}
const init: MetadatasState = {
  platforms: {
    data: {} as Data,
    selected: "0",
    previous_selected: "0"
  },
  versions: {
    data: {} as Data,
    selected: "0",
    previous_selected: "0"
  },
  environments: {
    data: {} as Data,
    selected: "0",
    previous_selected: "0"
  }
}

export function metadatas_reducer(state = init, action: Action): MetadatasState {
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