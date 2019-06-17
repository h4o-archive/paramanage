import { FETCH, SELECT, DESELECT, ACTIVE, DEACTIVE, SET, Action } from "actions/types"
import { ProfileDB, CategoryDB, ParametreDB } from "apis";
import { _ } from "utils"
import * as Types from "utils/Types"

const init = {
  profile: {} as ProfileState,
  categorys: {} as CategorysState,
  parametres: {} as ParametresState,
  selected: {} as SelectedParametresState,
  select_mode: false as boolean,
} as const

export function parametres_reducer(state = init, action: Action): typeof init {
  switch (action.type) {
    case FETCH.PROFILE:
      return { ...state, ...action.payload };
    case FETCH.CATEGORYS:
      return { ...state, categorys: action.payload };
    case SELECT.PARAMETRE:
      return { ...state, selected: { ...state.selected, [action.payload]: true } }
    case DESELECT.PARAMETRE:
      return { ...state, selected: _.omit(state.selected, [action.payload]) }
    case ACTIVE.SELECT_MODE:
      return { ...state, select_mode: true }
    case DEACTIVE.SELECT_MODE:
      return { ...state, select_mode: false, selected: {} }
    case SET.PROFILE_NAME:
      return { ...state, profile: { ...state.profile, editable_key: action.payload } }
    default:
      return state;
  }
}

export type ProfileState = ProfileDB & { editable_key: string }
export type CategorysState = Readonly<Types.OverloadObject<CategoryDB>>
export type ParametresState = Readonly<Types.OverloadObject<ParametreDB>>
export type SelectedParametresState = Readonly<Types.OverloadObject<boolean>>