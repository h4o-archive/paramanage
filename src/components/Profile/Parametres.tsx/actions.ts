import { FETCH, ReduxThunk } from "actions/types"
import { _ } from "utils"
import { api } from "apis"

export function fetchProfile(id: string): ReduxThunk {
  return async (dispatch) => {
    try {
      const { data: profile } = await api.get({ url: `/profiles`, id })
      const { data: parametres } = await api.get({ url: `/profiles/${id}/parametres` })
      const { data: categorys } = await api.get({ url: `/categorys` })

      await dispatch(
        {
          type: FETCH.CATEGORYS,
          payload: _.keyBy(categorys, "id")
        }
      )
      dispatch(
        {
          type: FETCH.PROFILE,
          payload: { profile, parametres: _.keyBy(parametres, "id") }
        }
      )
    } catch (e) {
      console.log(e)
    }
  }
}