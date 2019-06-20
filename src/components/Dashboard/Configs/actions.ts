import { _ } from "utils";
import { api, ConfigDB, ProfileDB, MutualProfileDB } from "apis"
import { FETCH, ReduxThunk } from "actions/types"

/**
 *
 *
 * @description fetch configs for such metadatas from db
 */
export function fetchConfigs(selected_platform: string, selected_version: string, selected_environment: string): ReduxThunk {
  return async (dispatch) => {

    const { data: configs } = await api.get({
      url: `/configs`,
      params: {
        platformId: selected_platform,
        versionId: selected_version,
        environmentId: selected_environment
      }
    })

    let enhanced_configs = []
    for (let i = 0; i < configs.length; i++) {
      const { data: profile } = await api.get({ url: `/profiles`, id: (configs as ConfigDB[])[i].profileId })
      const { data: mutual_profile } = await api.get({ url: `/profiles`, id: (configs as ConfigDB[])[i].mutual_profileId })
      enhanced_configs.push({
        ...configs[i],
        profile: (profile as ProfileDB).key,
        mutual_profile: (mutual_profile as MutualProfileDB).key
      })
    }

    dispatch(
      {
        type: FETCH.CONFIGS,
        payload: _.keyBy(enhanced_configs, "id"),
      }
    )
  }
}