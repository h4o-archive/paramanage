import { api } from "apis"
import { history } from "utils/history"
import { ReduxThunk } from "actions/types"



export function updateProfile(): ReduxThunk {
  return async (dispatch, getState) => {
    const { profile } = getState().parametres_reducer;
    api.patch({ url: `/profiles`, id: profile.id, json: { key: profile.editable_key } })
    history.push("/")
  }
}
