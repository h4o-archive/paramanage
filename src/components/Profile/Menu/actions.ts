import { api } from "apis"
import { history } from "utils/history"
import { ReduxThunk } from "actions/types"
import { _ } from "utils"
import { SLEEP_TIME, COLOR } from "utils/const"
import { updateParametres } from "./ProfileMenuModal/actions"
import csv from "csv"

export function updateProfile(): ReduxThunk {
  return async (dispatch, getState) => {
    const profile = getState().parametres_reducer.profile;
    const { data: db_profile } = await api.get({ url: "/profiles", id: _.hashText(profile.editable_key) })
    if (profile.editable_key !== "" && _.isEmpty(db_profile)) {
      const { data: db_configs } = await api.get({ url: `profiles/${profile.id}/configs` })
      const { data: db_configs_with_mutual_profile } = await api.get({ url: `mutual_profiles/${profile.id}/configs` })
      const { data: db_parametres } = await api.get({ url: `profiles/${profile.id}/parametres` })
      for (let i = 0; i < db_configs.length; i++) {
        await api.patch({ url: `/configs`, id: db_configs[i].id, json: { profileId: _.hashText(profile.editable_key) } })
        await _.sleep(SLEEP_TIME)
      }
      for (let i = 0; i < db_configs_with_mutual_profile.length; i++) {
        await api.patch({ url: `/configs`, id: db_configs_with_mutual_profile[i].id, json: { mutual_profileId: _.hashText(profile.editable_key) } })
        await _.sleep(SLEEP_TIME)
      }
      for (let i = 0; i < db_parametres.length; i++) {
        await api.patch({ url: `/parametres`, id: db_parametres[i].id, json: { profileId: _.hashText(profile.editable_key) } })
        await _.sleep(SLEEP_TIME)
      }
      await api.post({ url: "/profiles", json: { id: _.hashText(profile.editable_key), key: profile.editable_key } })
      await api.delete({ url: "/profiles", id: profile.id })

      const { data: db_profile } = await api.get({ url: "/mutual_profiles", id: profile.id })
      if (!_.isEmpty(db_profile)) {
        await api.post({ url: "/mutual_profiles", json: { id: _.hashText(profile.editable_key), key: profile.editable_key } })
        await api.delete({ url: "/mutual_profiles", id: profile.id })
      }
    }
    if (!(profile.editable_key !== profile.key && !_.isEmpty(db_profile))) history.push("/")
  }
}

type SuitableType = {
  key: string,
  value: string,
  [keys: string]: string
}

export function importParametres({ target: { files: [file] } }: { target: any }): ReduxThunk {
  return (dispatch) => {
    const reader = new FileReader()
    reader.readAsText(file, "UTF-8")
    reader.onload = ({ target: { result } }: { target: any }) => {
      if (file.name.split(".").pop() === "json") {
        dispatch(updateParametres((JSON.parse(result) as SuitableType[]).map(parametre => {
          return {
            id: _.hashText(parametre.key),
            key: parametre.key,
            value: parametre.value,
            category: parametre.category || "SANS CATEGORY",
            category_color: parametre.category ? parametre.category_color : COLOR.GREY
          }
        })))
      } else {
        // @ts-ignore
        csv.parse(result, (err: any, data: any) => {
          console.log(data);
        })
      }
    }
  }
}
