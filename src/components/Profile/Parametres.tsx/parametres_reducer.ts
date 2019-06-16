import { FETCH, SELECT, DESELECT, ACTIVE, DEACTIVE, SET, Action } from "actions/types"
import { ProfileDB, CategoryDB, ParametreDB } from "apis";
import { _ } from "utils"
import * as Types from "utils/Types"

const init = {
  profile: {} as ProfileDB,
  categorys: {} as Readonly<Types.OverloadObject<CategoryDB>>,
  parametres: {} as Readonly<Types.OverloadObject<ParametreDB>>,
  selected: {} as Readonly<Types.OverloadObject<boolean>>,
  select_mode: false as boolean,
  tempo_profile_name: "" as string
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
    case SET.TEMPO_PROFILE_NAME:
      return { ...state, tempo_profile_name: action.payload }
    default:
      return state;
  }
} 