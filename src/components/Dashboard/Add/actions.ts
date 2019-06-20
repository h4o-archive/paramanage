import { _, Types } from "utils";
import { api, VersionDB, ConfigDB, MutualProfileDB, ProfileDB, PlatformDB } from "apis"
import { fetchVersions, fetchPlatforms, fetchEnvironments } from "components/Dashboard/Metadatas/actions"
import { SLEEP_TIME } from "utils/const"
import { ReduxThunk } from "actions/types";
import { DashboardAddModalState } from "./dashboard_add_modal_reducer";
import { EnvironmentState } from "../Metadatas/metadatas_reducer";

/**
 * NAME CONVENTION
 * @var version_text version with dot, ex: 1.2.0 || 1.02.0
 * @var standarlized_base_version_order version as normalized number, ex: 10200
 * @var range_version array of all minor versions ex [{1.1.1}, {1.1.2}...]
 * @var all_configs all of configs of the latest versions for a selected platform
 * @var hash_range_version hash of array range_version
 */

/**
 *
 *
 * @description call internal action base on type
 */
export function add(type: DashboardAddModalState, data: string): ReduxThunk {
  switch (type) {
    case "version":
      return addVersion(data)
    case "platform":
      return addPlatform(data)
    case "environment":
      return addEnvironment(data)
  }
}

type __addBulkConfigs__dependencies = Readonly<{
  range_version: RangeVersion,
  selected_platform: string,
  new_version_id: string,
  environments: Readonly<Types.OverloadObject<EnvironmentState>>
}>

const __addBulkConfigs__dependency_injector = _.createDependencyInjector<__addBulkConfigs__dependencies>()

/**
 *
 *
 * @description get latest versions => __deprecateOldLatestVersion__ => __addNewVersionToServer__ => __getAllConfigs__ => __addBulkConfigs__ => fetchVersions()
 */
function addVersion(version_text: string): ReduxThunk {

  return async (dispatch, getState): Promise<void> => {

    const selected_platform = getState().metadatas_reducer.platforms.selected

    try {

      const { data: latest_versions } = await api.get({
        url: `/versions`,
        params: { latest: true }
      })
      await __deprecateOldLatestVersion__(latest_versions as VersionDB[])

      __addBulkConfigs__dependency_injector.declare({
        range_version: __generateRangeOfVersion__(__parseStandarlizeVersionOrder__(version_text)),
        selected_platform,
        new_version_id: await __addNewVersionToServer__(selected_platform, version_text),
        environments: getState().metadatas_reducer.environments.data
      })

      await __addBulkConfigs__(await __getAllConfigs__(latest_versions as VersionDB[], selected_platform))

    } catch (e) {
      console.error("ERROR: ADD NEW VERSION")
      console.error(e)
    }

    dispatch(fetchVersions())
  }
}

/**
 * 
 * @returns version as normalized number, ex: 10200
 */
function ____parseStandarlizeVersionOrder____(version_text: string): string {

  let parts = version_text.split(".");

  for (let i = 1; i < parts.length; i++) {
    if (parts[i].length === 1) {
      parts[i] = `0${parts[i]}`
    }
  }

  return `${parts[0]}${parts[1]}${parts[2]}`
}

export const __parseStandarlizeVersionOrder__ = _.memoize(____parseStandarlizeVersionOrder____)

/**
 *
 *
 * @param version_name version with dot, ex: 1.2.0 || 1.02.0 or version as normalized number, ex: 10200
 * @returns version as normalized text, ex: 1.2.1
 */
function ____parseStandarlizeVersionText____(version_name: string): string {

  let parts = []

  if (version_name.includes(".")) {

    parts = version_name.split(".");

    for (let i = 0; i < parts.length; i++) {
      if (parts[i].length === 2 && parts[i][0] === "0") {
        parts[i] = parts[i][1]
      }
    }

  } else {

    parts.push(version_name.slice(0, -4));
    parts.push(version_name.slice(-4, -2));
    parts.push(version_name.slice(-2));

    for (let i = 0; i < parts.length; i++) {
      if (parts[i].length === 2 && parts[i][0] === "0") {
        parts[i] = parts[i][1]
      }
    }

  }

  return `${parts[0]}.${parts[1]}.${parts[2]}`
}

const __parseStandarlizeVersionText__ = _.memoize(____parseStandarlizeVersionText____)

type RangeVersion = Readonly<{ "text": string, "order": string }>[]

function ____generateRangeOfVersion____(standarlized_base_version_order: string): RangeVersion {

  let range_version = []

  for (let i = parseInt(standarlized_base_version_order), end_version = i + 20; i < end_version; i++) {
    range_version.push({ "text": __parseStandarlizeVersionText__(`${i}`), "order": `${i}` })
  }

  return range_version
}

const __generateRangeOfVersion__ = _.memoize(____generateRangeOfVersion____)

/**
 *
 *
 * @description patch db of latest versions with latest = false
 */
async function __deprecateOldLatestVersion__(latest_versions: VersionDB[]): Promise<void> {

  for (let i = 0; i < latest_versions.length; i++) {
    await api.patch({
      url: `/versions`,
      id: latest_versions[i].id,
      json: { latest: false }
    })
    await _.sleep(SLEEP_TIME)
  }

}

/**
 *
 *
 * @description add new created version to db with latest = true
 * @returns id of new created version
 */
async function __addNewVersionToServer__(selected_platform: string, version_text: string): Promise<string> {

  const standarlized_base_version_order = __parseStandarlizeVersionOrder__(version_text)
  const id = `${selected_platform}${standarlized_base_version_order}`
  const new_version: VersionDB = {
    "platformId": selected_platform,
    id,
    "order": standarlized_base_version_order,
    "key": __parseStandarlizeVersionText__(version_text),
    latest: true
  }

  try {
    await api.post({ url: "/versions", json: new_version })
  } catch (e) {
    console.error("ERROR __addNewVersionToServer__")
    throw e
  }

  return id
}

async function __getAllConfigs__(latest_versions: VersionDB[], selected_platform: string): Promise<ConfigDB[]> {

  let all_configs: ConfigDB[] = [];

  for (let i = 0; i < latest_versions.length; i++) {
    try {

      var { data: configs } = await api.get({
        url: "/configs",
        params: {
          versionId: latest_versions[i].id,
          platformId: selected_platform
        }
      })

      await _.sleep(SLEEP_TIME)
    } catch (e) {
      console.error("ERROR __getAllConfigs__")
      throw e
    }

    if (!_.isEmpty(configs)) all_configs = [...all_configs, ...(configs as ConfigDB[])]
  }

  return all_configs.sort(_.compareObjectDescendinBaseOnKey("order"))
}

/**
 *
 * @description decision base on all config existing
 */
async function __addBulkConfigs__(all_configs: ConfigDB[]): Promise<void> {
  if (all_configs.length > 0) {
    await __addBulkConfigsIfExisted__(all_configs)
  } else {
    await __initBulkConfigs__()
  }
}

/**
 *
 * @description add new bulk configs based on existed configs
 */
async function __addBulkConfigsIfExisted__(all_configs: ConfigDB[]): Promise<void> {

  const { environments } = __addBulkConfigs__dependency_injector.inject()
  let accepted_found = _.reduce(environments, (accepted_found, key) => { accepted_found[environments[key].id] = false }, {} as Types.OverloadObject<boolean>)

  for (let i = 0; i < all_configs.length; i++) {

    await __addExistedBulkConfigsWithVersionReplace__(all_configs[i])

    if (all_configs[i].status === "ACC" && !accepted_found[all_configs[i].environmentId]) {
      accepted_found[all_configs[i].environmentId] = true;
      await __addNewBulkConfigs__(all_configs[i])
    }

  }

}

/**
 *
 * @description replace the versionId thus id in existing config, then update db
 */
async function __addExistedBulkConfigsWithVersionReplace__(config: ConfigDB): Promise<void> {

  const { new_version_id } = __addBulkConfigs__dependency_injector.inject()
  let new_config = {
    ...config,
    versionId: new_version_id
  }
  new_config.id = `${new_config.platformId}${new_config.versionId}${new_config.environmentId}${new_config.order}`

  try {
    await api.post({ url: "/configs", json: new_config })
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
async function __addNewBulkConfigs__(config: ConfigDB): Promise<void> {

  const { range_version, new_version_id } = __addBulkConfigs__dependency_injector.inject()

  for (let i = 0; i < range_version.length; i++) {

    let new_config = {
      ...config,
      versionId: new_version_id,
      order: range_version[i].order,
      version: range_version[i].text
    }
    new_config.id = `${new_config.platformId}${new_config.versionId}${new_config.environmentId}${new_config.order}`

    try {
      await api.post({ url: "/configs", json: new_config })
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
async function __initBulkConfigs__(): Promise<void> {

  const { range_version, selected_platform, new_version_id, environments } = __addBulkConfigs__dependency_injector.inject()
  const hash_range_version = _.hashText(JSON.stringify(_.keyBy(range_version, "key")))

  try {

    const { data: mutual_profiles } = await api.get({ url: "/mutual_profiles" })

    const new_mutual_profile = await __addNewMutualProfileToServerIfNecessary__(hash_range_version, mutual_profiles as MutualProfileDB[])

    const new_profile = await __addNewProfile__(hash_range_version, selected_platform)

    await __initNewBulkConfigs__({ range_version, selected_platform, new_version_id, environments, new_mutual_profile, new_profile })

  } catch (e) {
    console.error("ERROR __initBulkConfigs__")
    throw e
  }
}

/**
 *
 *
 * @returns new mutual profile if nothing exist otherwise return existed mutual profile
 */
async function __addNewMutualProfileToServerIfNecessary__(hash_range_version: string, mutual_profiles: MutualProfileDB[]): Promise<MutualProfileDB> {

  if (_.isEmpty(mutual_profiles)) {

    const new_mutual_profile: MutualProfileDB = {
      id: _.hashText(`__MUTUAL PROFILE INIT__${hash_range_version}`),
      key: `__MUTUAL PROFILE INIT__${hash_range_version}`
    }

    try {
      await api.post({ url: "/profiles", json: new_mutual_profile })
      await api.post({ url: "/mutual_profiles", json: new_mutual_profile })
    } catch (e) {
      console.error("ERROR __addNewMutualProfileToServerIfNecessary__")
      throw e
    }

    return new_mutual_profile

  } else {
    return mutual_profiles[0]
  }
}

/**
 *
 *
 * @returns new profile
 */
async function __addNewProfile__(hash_range_version: string, selected_platform: string): Promise<ProfileDB> {
  const new_profile = await __checkIfProfileExisted__(_.hashText(`${hash_range_version}${selected_platform}`))
  try {
    await api.post({ url: "/profiles", json: new_profile })
  } catch (e) {
    console.error("ERROR __addNewProfile__")
    throw e
  }
  return new_profile
}


/**
 *
 *
 * @returns new profile that did not exist
 */
async function __checkIfProfileExisted__(hash_number_name: string): Promise<ProfileDB> {

  let id = `${hash_number_name}`
  let key = ""
  let profile = {}

  do {
    key = `__PROFILE INIT__${id}`
    id = _.hashText(key);

    try {
      ({ data: profile } = await api.get({ url: `/profiles`, id }))
    } catch (e) {
      profile = {}
    }

  } while (!_.isEmpty(profile));

  return { id, key }
}

type __initNewBulkConfigs__params = Readonly<{
  range_version: RangeVersion,
  selected_platform: string,
  new_version_id: string,
  environments: Readonly<Types.OverloadObject<EnvironmentState>>,
  new_mutual_profile: MutualProfileDB,
  new_profile: ProfileDB
}>
/**
 *
 *
 * @description update configs for each minor version and each environment in db
 */
async function __initNewBulkConfigs__({ range_version, selected_platform, new_version_id, environments, new_mutual_profile, new_profile }: __initNewBulkConfigs__params): Promise<void> {

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
        profileId: new_profile.id,
        id: ""
      }
      new_config.id = `${new_config.platformId}${new_config.versionId}${new_config.environmentId}${new_config.order}`

      try {
        await api.post({ url: "/configs", json: new_config })
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
 * @description add platform to db => fetchPlatforms()
 */
function addPlatform(platform: string): ReduxThunk {

  const hash_platform = _.hashText(platform)

  return async (dispatch) => {

    try {

      await api.post({
        url: "/platforms",
        json: {
          id: hash_platform,
          order: platform.toLowerCase(),
          key: platform
        } as PlatformDB
      })

    } catch (e) {
      console.error("ERROR: ADD NEW PLATFORM")
      console.error(e)
    }
    dispatch(fetchPlatforms())
  }
}

/**
 *
 *
 * @description __addNewEnvironmentToServer__ => __addExistedBulkConfigsWithEnvironmentReplace__ => fetchEnvironments()
 */
function addEnvironment(environment: string): ReduxThunk {

  return async (dispatch) => {

    try {

      await __addNewEnvironmentToServer__(environment)

      const { data: configs } = await api.get({
        url: `/configs`,
        params: {
          environmentId: _.hashText("Production")
        }
      })

      await __addExistedBulkConfigsWithEnvironmentReplace__(configs as ConfigDB[], _.hashText(environment))

    } catch (e) {
      console.error("ERROR: ADD ENVIRONMENT")
      console.error(e)
    }
    dispatch(fetchEnvironments())
  }
}

/**
 *
 * @description add new environment to db
 */
async function __addNewEnvironmentToServer__(environment: string): Promise<void> {

  const new_environment = {
    id: _.hashText(environment),
    order: environment.toLowerCase(),
    key: environment
  }

  try {
    await api.post({ url: "/environments", json: new_environment })
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
async function __addExistedBulkConfigsWithEnvironmentReplace__(configs: ConfigDB[], hash_environment: string): Promise<void> {

  for (let i = 0; i < configs.length; i++) {

    let new_config = { ...configs[i], environmentId: hash_environment }
    new_config.id = `${new_config.platformId}${new_config.versionId}${new_config.environmentId}${new_config.order}`

    try {
      await api.post({ url: "/configs", json: new_config })
      await _.sleep(SLEEP_TIME)
    } catch (e) {
      console.error("ERROR __addExistedBulkConfigsWithEnvironmentReplace__");
      throw e
    }
  }
}