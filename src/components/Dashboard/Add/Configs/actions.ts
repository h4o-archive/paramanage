import { _ } from "utils";
import { api, ConfigDB, ProfileDB, MutualProfileDB } from "apis"
import { FETCH, ReduxThunk } from "actions/types"

/**
 *
 *
 * @description fetch configs for such metadatas from db
 */
export function fetchConfigs(platformId: string, versionId: string, environmentId: string): ReduxThunk {
  return async (dispatch) => {
    try {

      let { data: configs } = await api.get({
        url: `/configs`,
        params: {
          platformId,
          versionId,
          environmentId
        }
      })

      let enhanced_configs = []
      for (let i = 0; i < configs.length; i++) {
        let { data: profile } = await api.get({ url: `/profiles`, id: (configs as ConfigDB[])[i].profileId })
        let { data: mutual_profile } = await api.get({ url: `/profiles`, id: (configs as ConfigDB[])[i].mutual_profileId })
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
    } catch (e) {
      console.error(e)
    }
  }
}