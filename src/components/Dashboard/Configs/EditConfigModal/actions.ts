import { api } from "apis"
import { fetchConfigs } from "components/Dashboard/Configs/actions"
import { _ } from "utils"
import { ReduxThunk } from "actions/types";
import { FormValues } from "."

export function updateConfig({ status, profile, mutual_profile }: FormValues): ReduxThunk {
  return async (dispatch, getState) => {
    const { data: db_profile } = await api.get({ url: "/profiles", id: _.hashText(profile) })
    if (_.isEmpty(db_profile)) await api.post({ url: "/profiles", json: { id: _.hashText(profile), key: profile } })

    const { data: db_mutual_profile } = await api.get({ url: "/mutual_profiles", id: _.hashText(mutual_profile) })
    if (_.isEmpty(db_mutual_profile)) await api.post({ url: "/mutual_profiles", json: { id: _.hashText(mutual_profile), key: mutual_profile } })

    let config = getState().edit_config_modal_reducer.config
    do {
      await api.patch({ url: "/configs", id: config.id, json: { status, profileId: _.hashText(profile), mutual_profileId: _.hashText(mutual_profile) } })
      config = config.next
      await _.sleep(100)
    } while (!_.isEmpty(config))

    let { platforms, versions, environments } = getState().metadatas_reducer
    dispatch(fetchConfigs(platforms.selected, versions.selected, environments.selected))
  }
}