import { api } from "apis"
import { history } from "utils/history"
import { ReduxThunk } from "actions/types"
import { _ } from "utils"
import { SLEEP_TIME } from "utils/const"

export function updateProfile(): ReduxThunk {
  return async (dispatch, getState) => {
    // FLAW, becasue key is tightly coupled to id, changing only key might result in 2 profile with the same name
    const profile = getState().parametres_reducer.profile;
    if (profile.editable_key !== "" && profile.editable_key !== profile.key) {
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
    history.push("/")
  }
}
