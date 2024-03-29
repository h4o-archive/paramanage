import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { FETCH, SELECT, ReduxThunk } from "actions/types"
import { api, VersionDB } from "apis"
import { _, Types } from "utils";
import { State } from "reducers"

/**
 * @description fetch platforms => select one platform to display => trigger fetch versions of selected platform
 */
export function fetchPlatforms(): ReduxThunk {
  return async (dispatch, getState): Promise<void> => {

    const { data: platforms } = await api.get({ url: `/platforms` })
    await dispatch(
      {
        type: FETCH.PLATFORMS,
        payload: _.keyBy(platforms, "id")
      }
    )
    const selected_platform = __detectCurrentSelected__(getState().metadatas_reducer.platforms.previous_selected, platforms)
    await dispatch({
      type: SELECT.PLATFORM,
      payload: selected_platform
    })
    await __fetchVersions__(dispatch, getState, selected_platform);
    dispatch(fetchEnvironments())
  }
}

/**
 * @desciption get selected platform from state => trigger fetch versions of selected platform
 */
export function fetchVersions(): ReduxThunk {
  return async (dispatch, getState): Promise<void> => {
    const selected_platform = getState().metadatas_reducer.platforms.selected;
    await __fetchVersions__(dispatch, getState, selected_platform)
  }
}

/**
 * @description fetch environments => select one environment to display by calling __detectCurrentSelected__
 */
export function fetchEnvironments(): ReduxThunk {
  return async (dispatch, getState): Promise<void> => {
    const { data: environments } = await api.get({ url: `/environments` })
    await dispatch(
      {
        type: FETCH.ENVIRONMENTS,
        payload: _.keyBy(environments, "id")
      }
    )
    dispatch({
      type: SELECT.ENVIRONMENT,
      payload: __detectCurrentSelected__(getState().metadatas_reducer.environments.previous_selected, environments)
    })
  }
}
/**
 * @description fetch versions => select one version to display
 */
async function __fetchVersions__(dispatch: ThunkDispatch<State, void, AnyAction>, getState: () => State, selected_platform: string): Promise<void> {
  const { data: versions } = await api.get({ url: `/platforms/${selected_platform}/versions` })
  await dispatch(
    {
      type: FETCH.VERSIONS,
      payload: _.keyBy((versions as VersionDB[]).map(item => _.omit(item, ["platformId"])), "id")
    }
  )
  dispatch({
    type: SELECT.VERSION,
    payload: __detectCurrentSelected__(getState().metadatas_reducer.versions.previous_selected, versions)
  })
}

/**
 * @description check if current selected still exist in the new set of data, if so return current selected
 */
function __detectCurrentSelected__(current_selected: string, data: (Types.OverloadObject & { id: string })[]): string {
  if (data.length === 0) {
    return "0"
  }
  if (isNaN(data[0].order)) {
    data.sort(_.compareObjectAscendinBaseOnKey("order"))
  } else {
    data.sort(_.compareObjectDescendinBaseOnKey("order"))
  }
  if (current_selected !== "0") {
    for (let i = 0; i < data.length; i++) {
      if (current_selected === data[i].id) {
        return current_selected
      }
    }
  }
  return data[0].id
}