import React, { useEffect } from "react"
import { connect } from "react-redux"

import { _ } from "utils"
import { fetchConfigs } from "./actions"
import { ConfigState } from "./configs_reducer";
import { State } from "reducers";
import { TableHeader } from "./TableHeader"
import { Config } from "./Config"
import * as Types from "utils/Types"

type ConfigsProps = Readonly<{
  selected: {
    platform: string,
    version: string,
    environment: string
  }
  config_array: ConfigProp[],
  fetchConfigs: typeof fetchConfigs,
}>
/**
 * @description table of configs
 */
let Configs: React.FunctionComponent<ConfigsProps> = ({ config_array, selected, ...props }) => {

  let { version: selected_version, platform: selected_platform, environment: selected_environment } = selected
  useEffect(() => {
    if (selected_version !== "0" && selected_platform !== "0" && selected_environment !== "0") {
      props.fetchConfigs(selected_platform, selected_version, selected_environment)
    }
  }, [selected_version, selected_platform, selected_environment])

  return (
    <div className="ui centered equal width grid" style={{ height: "80%" }}>

      <TableHeader className="row" style={{ marginTop: "3em", marginLeft: "2em" }} />
      <div className="ui divider"></div>

      {config_array.map(config => {
        return (
          // @ts-ignore ignore missing property dispatchAction, not worth breaking up the props in Config component
          <Config config={config} />
        )
      })}

    </div>
  )
}


function mapStateToProps(state: State): Types.OverloadOmit<ConfigsProps, "fetchConfigs"> {

  function twoConfigsAreIdentical(config1: ConfigState, config2: ConfigState): boolean {
    if (config1.profileId === config2.profileId && config1.status === config2.status) return true
    return false
  }

  let tree_id = `${_.createUniqueID()}`
  let previous = {} as ConfigProp
  let node = {} as ConfigProp
  let config_array = Object.values(state.configs_reducer.configs).sort(_.compareObjectDescendinBaseOnKey("order")).reduce((config_array, config, index, raw_config_array) => {

    if (raw_config_array[index + 1] && twoConfigsAreIdentical(config, raw_config_array[index + 1])) {
      if (_.isEmpty(previous)) {
        config_array.push({ ...config, tree_id, next: { ...config, tree_id, next: previous, last: "" }, last: "" })
        previous = config_array[config_array.length - 1].next
        node = config_array[config_array.length - 1]
      } else {
        previous.next = { ...config, tree_id, next: {} as ConfigProp, last: "" }
        previous = previous.next
      }
    } else {
      if (_.isEmpty(previous)) {
        config_array.push({ ...config, tree_id: "0", next: previous, last: "" })
      } else {
        previous.next = { ...config, tree_id, next: {} as ConfigProp, last: "" }
        previous = {} as ConfigProp
        node.last = config.version
        tree_id = `${_.createUniqueID()}`
      }
    }

    return config_array
  }, [] as ConfigProp[])

  return {
    selected: {
      platform: state.metadatas_reducer.platforms.selected,
      version: state.metadatas_reducer.versions.selected,
      environment: state.metadatas_reducer.environments.selected
    },
    config_array
  }
}

Configs = connect(mapStateToProps, { fetchConfigs })(Configs) as any
export { Configs }
export type ConfigProp = { tree_id: string, next: ConfigProp, last: string } & ConfigState