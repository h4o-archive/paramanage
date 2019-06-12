import { FETCH, SELECT, SET, Action } from "actions/types"
import { PlatformDB, VersionDB, EnvironmentDB } from "apis";

const init = {
  platforms: {
    data: {} as Readonly<_.type.Object<PlatformState>>,
    selected: "0" as string,
    previous_selected: "0" as string
  },
  versions: {
    data: {} as Readonly<_.type.Object<VersionState>>,
    selected: "0" as string,
    previous_selected: "0" as string
  },
  environments: {
    data: {} as Readonly<_.type.Object<EnvironmentState>>,
    selected: "0" as string,
    previous_selected: "0" as string
  }
} as const

export function metadatas_reducer(state = init, action: Action): typeof init {
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

export type PlatformState = PlatformDB
export type VersionState = Pick<VersionDB, Exclude<keyof VersionDB, "platformId" | "latest">>
export type EnvironmentState = EnvironmentDB