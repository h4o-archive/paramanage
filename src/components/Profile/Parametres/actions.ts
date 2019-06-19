import { FETCH, ReduxThunk } from "actions/types"
import { _ } from "utils"
import { api, ProfileDB } from "apis"

export function fetchProfile(id: string): ReduxThunk {
  return async (dispatch) => {

    const { data: profile } = await api.get({ url: `/profiles`, id })
    const { data: parametres } = await api.get({ url: `/profiles/${id}/parametres` })
    const { data: categorys } = await api.get({ url: `/categorys` })

    // hold all categorys in state because in the current backend architecture there is no way to fetch only using category
    // without fetching all the categorys, so we hold all in state also for async validating
    await dispatch(
      {
        type: FETCH.CATEGORYS,
        payload: _.keyBy(categorys, "id")
      }
    )
    dispatch(
      {
        type: FETCH.PROFILE,
        payload: {
          profile: { ...profile, editable_key: (profile as ProfileDB).key },
          parametres: _.keyBy(parametres, "id")
        }
      }
    )
  }
}