import { api } from "apis"
import { history } from "utils/history"
import { ReduxThunk } from "actions/types"

export function updateProfile(): ReduxThunk {
  return async (dispatch, getState) => {
    // FLAW, becasue key is tightly coupled to id, changing only key might result in 2 profile with the same name
    const profile = getState().parametres_reducer.profile;
    if (profile.editable_key !== "") {
      api.patch({ url: `/profiles`, id: profile.id, json: { key: profile.editable_key } })
      history.push("/")
    }
  }
}
