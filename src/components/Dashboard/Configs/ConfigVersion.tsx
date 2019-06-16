import React from "react"

import { ConfigProp } from ".";
import { Button } from "components/Common/Button"
import * as Types from "utils/Types"

type ConfigVersionOwnProps = Readonly<{
  config: ConfigProp,
  useParentState: () => { expand_state: Types.OverloadObject<boolean>, setExpandState: React.Dispatch<React.SetStateAction<Types.OverloadObject<boolean>>> }
}>
/**
 * @description the version information of config
 */
export const ConfigVersion: React.FunctionComponent<ConfigVersionOwnProps> = ({ config, ...props }) => {

  const { expand_state, setExpandState } = props.useParentState()

  function onPlageClick(tree_id: string): (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void {
    return (): void => {
      setExpandState({ [tree_id]: !expand_state[tree_id] })
    }
  }

  const VersionIndicator: React.FunctionComponent<{ text: string }> = ({ text }) => {
    return (
      <span style={{ backgroundColor: (config.tree_id === "0" || (config.last !== "")) ? "rgb(5, 174, 252)" : "grey", padding: "0.5em 0.5em 0.5em 0.5em", borderRadius: "0.5em 0.5em 0.5em 0.5em", float: "left" }}>
        {text}
      </span>
    )
  }

  if (config.last !== "") {
    return (
      <React.Fragment>

        <VersionIndicator text={config.last} />
        <i className="arrow right black icon" style={{ float: "left", marginTop: "0.5em", marginBottom: "0.5em" }}></i>
        <VersionIndicator text={config.version} />
        <Button icon={`angle ${!expand_state[config.tree_id] ? "down" : "up"} grey icon`} style={{ float: "left" }} onClick={onPlageClick(config.tree_id)} transparent />

      </React.Fragment>
    )
  } else {
    return <VersionIndicator text={config.version} />
  }
}