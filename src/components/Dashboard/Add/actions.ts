import { _ } from "utils";
import { api } from "apis"
import { fetchVersions, fetchPlatforms, fetchEnvironments } from "components/Dashboard/Metadatas/actions"
import { SLEEP_TIME } from "utils/const"
import { ReduxThunk } from "actions/types";
import { modal_state } from "./dashboard_add_modal_reducer";

/**
 *
 *
 * @description call internal action base on type
 */
export function add(type: modal_state, data: string): ReduxThunk {
  switch (type) {
    case "version":
      return addVersion(data)
    case "platform":
      return addPlatform(data)
    case "environment":
      return addEnvironment(data)
  }
}

/**
 *
 *
 * @description get latest versions => __deprecateOldLatestVersion__ => __addNewVersionToServer__ => __getAllConfigs__ => __addBulkConfigs__ => fetchVersions()
 * @param {string} version_text version as string, ex: 1.2.0 || 1.02.0
 * @returns {function} redux-thunk
 */
function addVersion(version_text: string): ReduxThunk {
  let standarlized_base_version_order = __parseStandarlizeVersionOrder__(version_text)
  let range_version = __generateRangeOfVersion__(standarlized_base_version_order)

  return async (dispatch, getState) => {
    let selected_platform = getState().metadatas_reducer.platforms.selected
    let environments = getState().metadatas_reducer.environments.data
    try {
      let { data: latest_versions } = await api.get(`/versions?latest=true`)
      await __deprecateOldLatestVersion__(latest_versions)
      let new_version_id = await __addNewVersionToServer__({ selected_platform, version_text, standarlized_base_version_order })
      let all_configs = await __getAllConfigs__({ latest_versions, selected_platform })
      await __addBulkConfigs__({ all_configs, range_version, selected_platform, new_version_id, environments })
    } catch (e) {
      console.error("ERROR: ADD NEW VERSION")
      console.error(e)
    }
    dispatch(fetchVersions())
  }
}

/**
 *
 *
 * @param {string} version_text
 * @returns {string} version as normalized number, ex: 10200
 */
export function __parseStandarlizeVersionOrder__(version_text: string): string {
  let parts = version_text.split(".");
  for (let i = 1; i < parts.length; i++) {
    if (parts[i].length === 1) {
      parts[i] = `0${parts[i]}`
    }
  }
  return `${parts[0]}${parts[1]}${parts[2]}`
}

/**
 *
 *
 * @param {string} version_text version with dot, ex: 1.2.0 || 1.02.0 or version as normalized number, ex: 10200
 * @returns {string} version as normalized text, ex: 1.2.1
 */
function __parseStandarlizeVersionText__(version_text) {
  let parts = []
  if (version_text.includes(".")) {
    parts = version_text.split(".");
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].length === 2 && parts[i][0] === "0") {
        parts[i] = parts[i][1]
      }
    }
  } else {
    parts[2] = version_text.slice(-2);
    parts[1] = version_text.slice(-4, -2);
    parts[0] = version_text.slice(0, -4);
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].length === 2 && parts[i][0] === "0") {
        parts[i] = parts[i][1]
      }
    }
  }
  return `${parts[0]}.${parts[1]}.${parts[2]}`
}

/**
 *
 * @typedef {Object} version_in_range
 * @property {string} text
 * @property {string} order
 */
/**
 * 
 * 
 * @param {string} standarlized_base_version_order
 * @returns {version_in_range[]} array of all minor versions ex [{1.1.1}, {1.1.2}...]
 */
function __generateRangeOfVersion__(standarlized_base_version_order) {
  let range_version = []
  for (let i = parseInt(standarlized_base_version_order), end_version = i + 20; i < end_version; i++) {
    range_version.push({ "text": __parseStandarlizeVersionText__(`${i}`), "order": `${i}` })
  }
  return range_version
}

/**
 *
 *
 * @description patch db of latest versions with latest = false
 */
async function __deprecateOldLatestVersion__(latest_versions) {
  for (let i = 0; i < latest_versions.length; i++) {
    await api.patch(`/versions/${latest_versions[i].id}`, { latest: false })
    await _.sleep(SLEEP_TIME)
  }
}

/**
 *
 *
 * @description add new created version to db with latest = true
 * @returns {Promise<string>} id of new added version
 */
async function __addNewVersionToServer__({ selected_platform, version_text, standarlized_base_version_order }) {
  let id = `${selected_platform}${standarlized_base_version_order}`
  let new_version = {
    "platformId": selected_platform,
    id,
    "order": standarlized_base_version_order,
    "key": __parseStandarlizeVersionText__(version_text),
    latest: true
  }
  try {
    await api.post("/versions", new_version)
  } catch (e) {
    console.error("ERROR __addNewVersionToServer__")
    throw e
  }
  return id
}

/**
 *
 *
 * @returns {Promise<Array>} all of configs of the latest versions for a selected platform
 */
async function __getAllConfigs__({ latest_versions, selected_platform }) {
  let all_configs = [];
  for (let i = 0; i < latest_versions.length; i++) {
    try {
      var { data: configs } = await api.get(`/configs?versionId=${latest_versions[i].id}&platformId=${selected_platform}`)
      await _.sleep(SLEEP_TIME)
    } catch (e) {
      console.error("ERROR __getAllConfigs__")
      throw e
    }
    if (!_.isEmpty(configs)) all_configs = [...all_configs, ...configs]
  }
  return all_configs
}

/**
 *
 * @description decision base on all config existing
 */
async function __addBulkConfigs__({ all_configs, range_version, selected_platform, new_version_id, environments }) {
  if (all_configs.length > 0) {
    await __addBulkConfigsIfExisted__({ all_configs, range_version, new_version_id, environments })
  } else {
    await __initBulkConfigs__({ range_version, selected_platform, new_version_id, environments })
  }
}


/**
 *
 * @description add new bulk configs based on existed configs
 */
async function __addBulkConfigsIfExisted__({ all_configs, range_version, new_version_id, environments }) {
  let accepted_found = {}
  for (let key in environments) {
    accepted_found[environments[key].id] = false
  }
  for (let i = 0; i < all_configs.length; i++) {
    await __addExistedBulkConfigsWithVersionReplace__({ config: all_configs[i], new_version_id })
    if (all_configs[i].status === "ACC" && !accepted_found[all_configs[i].environmentId]) {
      accepted_found[all_configs[i].environmentId] = true;
      await __addNewBulkConfigs__({ config: all_configs[i], range_version, new_version_id })
    }
  }
}

/**
 *
 * @description replace the versionId thus id in existing config, then update db
 */
async function __addExistedBulkConfigsWithVersionReplace__({ config, new_version_id }) {
  config.versionId = new_version_id
  config = {
    ...config,
    versionId: new_version_id
  }
  config.id = `${config.platformId}${config.versionId}${config.environmentId}${config.key}`
  try {
    await api.post("/configs", config)
    await _.sleep(SLEEP_TIME)
  } catch (e) {
    console.error("ERROR __addExistedBulkConfigsWithVersionReplace__");
    throw e
  }
}

/**
 *
 *
 * @description add configs for new minor versions
 */
async function __addNewBulkConfigs__({ config, range_version, new_version_id }) {
  for (let i = 0; i < range_version.length; i++) {
    let new_config = {
      ...config,
      versionId: new_version_id,
      order: range_version[i].order,
      version: range_version[i].text
    }
    new_config.id = `${new_config.platformId}${new_config.versionId}${new_config.environmentId}${new_config.order}`
    try {
      await api.post("/configs", new_config)
      await _.sleep(SLEEP_TIME)
    } catch (e) {
      console.error("ERROR __addNewBulkConfigs__");
      throw e
    }
  }
}

/**
 *
 *
 * @description init configs for first version
 */
async function __initBulkConfigs__({ range_version, selected_platform, new_version_id, environments }) {
  let hash_range_version = _.hashText(JSON.stringify(_.keyBy(range_version, "key")))
  try {
    let { data: mutual_profiles } = await api.get("/mutual_profiles")
    let new_mutual_profile = await __addNewMutualProfileToServerIfNecessary__({ mutual_profiles, hash_range_version })
    let new_profile = await __addNewProfile__({ hash_range_version, selected_platform })
    await __initNewBulkConfigs__({ range_version, selected_platform, new_version_id, environments, new_mutual_profile, new_profile })
  } catch (e) {
    console.error("ERROR __initBulkConfigs__")
    throw e
  }
}

/**
 *
 *
 * @returns {Promise<Object>} new mutual profile if nothing exist otherwise return existed mutual profile
 */
async function __addNewMutualProfileToServerIfNecessary__({ mutual_profiles, hash_range_version }) {
  let new_mutual_profile = mutual_profiles[0]
  if (_.isEmpty(mutual_profiles)) {
    new_mutual_profile = {
      id: _.hashText(`__MUTUAL PROFILE INIT__${hash_range_version}`),
      key: `__MUTUAL PROFILE INIT__${hash_range_version}`
    }
    try {
      await api.post("/profiles", new_mutual_profile)
      await api.post("/mutual_profiles", new_mutual_profile)
    } catch (e) {
      console.error("ERROR __addNewMutualProfileToServerIfNecessary__")
      throw e
    }
  }
  return new_mutual_profile
}

/**
 *
 *
 * @returns {Promise<Object>} new profile
 */
async function __addNewProfile__({ hash_range_version, selected_platform }) {
  let number_name = `${hash_range_version}${selected_platform}`
  let hash_number_name = _.hashText(number_name)
  let { id, key } = await __checkIfProfileExisted__(hash_number_name)
  let new_profile = {
    id,
    key
  }
  try {
    await api.post("/profiles", new_profile)
  } catch (e) {
    console.error("ERROR __addNewProfile__")
    throw e
  }
  return new_profile
}


/**
 *
 *
 * @returns {Promise<{id: string, key: string}>} id and key of profile that name did not exist
 */
async function __checkIfProfileExisted__(hash_number_name) {
  let id = `${hash_number_name}`
  let key = ""
  let profile = {}
  do {
    key = `__PROFILE INIT__${id}`
    id = _.hashText(key);
    try {
      ({ data: profile } = await api.get(`/profiles/${id}`))
    } catch (e) {
      profile = {}
    }
  } while (!_.isEmpty(profile));
  return { id, key }
}

/**
 *
 *
 * @description update configs for each minor version and each environment in db
 */
async function __initNewBulkConfigs__({ range_version, selected_platform, new_version_id, environments, new_mutual_profile, new_profile }) {
  for (let i = 0; i < range_version.length; i++) {
    for (let key in environments) {
      let new_config = {
        platformId: selected_platform,
        versionId: new_version_id,
        environmentId: environments[key].id,
        order: range_version[i].order,
        status: "ACC",
        version: range_version[i].text,
        mutual_profileId: new_mutual_profile.id,
        profileId: new_profile.id
      }
      new_config.id = `${new_config.platformId}${new_config.versionId}${new_config.environmentId}${new_config.order}`

      try {
        await api.post("/configs", new_config)
        await _.sleep(SLEEP_TIME)
      } catch (e) {
        console.error("ERROR __initNewBulkConfigs__");
        throw e
      }
    }

  }
}

/**
 *
 *
 * @description wrapLoading => add platform to db => fetchPlatforms()
 * @param {string} platform name
 * @returns {function} redux-thunk
 */
function addPlatform(platform) {
  let hash_platform = _.hashText(platform)
  return async (dispatch) => {
    await wrapLoading(dispatch, async () => {
      try {
        await api.post("/platforms", {
          id: hash_platform,
          order: platform.toLowerCase(),
          key: platform
        })
      } catch (e) {
        console.error("ERROR: ADD NEW PLATFORM")
        console.error(e)
      }
    }, api.get)()
    dispatch(fetchPlatforms())
  }
}

/**
 *
 *
 * @description wrapLoading => __addNewEnvironmentToServer__ => __addExistedBulkConfigsWithEnvironmentReplace__ => fetchEnvironments()
 * @param {string} environment name
 * @returns {function} redux-thunk
 */
function addEnvironment(environment) {
  let hash_environment = _.hashText(environment)
  return async (dispatch) => {
    await wrapLoading(dispatch, async () => {
      try {
        await __addNewEnvironmentToServer__({ hash_environment, environment })
        let { data: configs } = await api.get(`/configs?environmentId=${_.hashText("Production")}`)
        await __addExistedBulkConfigsWithEnvironmentReplace__({ configs, hash_environment })
      } catch (e) {
        console.error("ERROR: ADD ENVIRONMENT")
        console.error(e)
      }
    }, api.get)()
    dispatch(fetchEnvironments())
  }
}

/**
 *
 * @description add new environment to db
 * @param {Object} params
 * @param {string} params.hash_environment
 * @param {string} params.environment
 */
async function __addNewEnvironmentToServer__({ hash_environment, environment }) {
  let new_environment = {
    id: hash_environment,
    order: environment.toLowerCase(),
    key: environment
  }
  try {
    await api.post("/environments", new_environment)
  } catch (e) {
    console.error("ERROR __addNewEnvironmentToServer__")
    throw e
  }
}

/**
 *
 *
 * @description with each config, replace with environment then add to db
 */
async function __addExistedBulkConfigsWithEnvironmentReplace__({ configs, hash_environment }) {
  for (let i = 0; i < configs.length; i++) {
    let new_config = { ...configs[i], environmentId: hash_environment }
    new_config.id = `${new_config.platformId}${new_config.versionId}${new_config.environmentId}${new_config.order}`
    try {
      await api.post("/configs", new_config)
      await _.sleep(SLEEP_TIME)
    } catch (e) {
      console.error("ERROR __addExistedBulkConfigsWithEnvironmentReplace__");
      throw e
    }
  }
}