import { FETCH, ADD, Action } from "actions/types"
import { ConfigDB } from "apis";
import * as Types from "utils/Types";

const init = {
  configs: {} as Readonly<Types.OverloadObject<ConfigState>>
} as const

export function configs_reducer(state = init, action: Action): typeof init {
  switch (action.type) {
    case FETCH.CONFIGS:
      return { ...state, configs: action.payload }
    case ADD.CONFIG:
      return { ...state, configs: { ...state.configs, ...action.payload } }
    default:
      return state;
  }
}

export type ConfigState = ConfigDB & Readonly<{
  profile: string,
  mutual_profile: string
}>