import { FETCH, ReduxThunk } from "actions/types"
import { _ } from "utils"
import { api, ProfileDB } from "apis"
import * as Types from "utils/Types"

export function fetchProfile(id: string): ReduxThunk {
  return async (dispatch) => {

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
        payload: {
          profile, parametres: _.reduce(_.keyBy(parametres, "id") as Readonly<Types.OverloadObject<ProfileDB>>, (parametres, key, raw_parametres) => {
            parametres[key] = { ...raw_parametres[key], editable_key: raw_parametres[key].key }
          }, {} as Types.OverloadObject<ProfileDB & { editable_key: string }>)
        }
      }
    )
  }
}