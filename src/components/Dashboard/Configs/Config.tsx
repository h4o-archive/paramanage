import React, { useState } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Dropdown } from "semantic-ui-react"

import { ConfigProp } from ".";
import { dispatchAction } from "components/actions";
import { SHOW } from "actions/types"
import { _ } from "utils"
import { CONFIG_STATUS } from "utils/const"
import { ConfigVersion } from "./ConfigVersion"
import * as Types from "utils/Types"

type ConfigProps = Readonly<{
  config: ConfigProp,
  dispatchAction: typeof dispatchAction
}>
/**
 * @description 1 line of config information
 */
let Config: React.FunctionComponent<ConfigProps> = ({ config, ...props }) => {

  let [expand_state, setExpandState] = useState({} as Types.OverloadObject<boolean>)

  function useParentState(): { expand_state: Types.OverloadObject<boolean>, setExpandState: React.Dispatch<React.SetStateAction<Types.OverloadObject<boolean>>> } {
    return { expand_state, setExpandState }
  }

  const EditButton: React.FunctionComponent = () => {

    let action_payload = {
      label: (_.isEmpty(config.next) || config.last === "") ? config.version : `${config.version} -> ${config.last}`,
      config
    }
    function onEditClick() {
      props.dispatchAction(SHOW.MODAL.EDIT_CONFIG, action_payload)
    }

    return (
      <Dropdown icon='ellipsis vertical' floating button className='icon' style={{ backgroundColor: "rgba(0,0,0,0)", width: "2.9em", marginRight: "-1em" }}>
        <Dropdown.Menu style={{ right: "auto", left: "0" }}>
          <Dropdown.Item onClick={onEditClick}>Edit</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  const Version: React.FunctionComponent = () => {
    return (
      <div className="middle aligned column" style={{ color: "white" }}>
        <ConfigVersion config={config} useParentState={useParentState} />
      </div>
    )
  }

  const Status: React.FunctionComponent = () => {
    return (
      <div className="middle aligned column" >
        <p style={{ textAlign: "left", color: CONFIG_STATUS[config.status].color }}>{config.status}</p>
      </div>
    )
  }

  const ProfileName: React.FunctionComponent<Readonly<{ to: string, profile: string }>> = (props) => {
    let profile_style: React.CSSProperties = { textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", lineClamp: 2, lineHeight: "1em", maxHeight: "2em" }
    return (
      <Link className="middle aligned column" to={`/profile/${props.to}`} style={profile_style}>{props.profile}</Link>
    )
  }

  return (
    <React.Fragment>
      <div className="row">
        <EditButton />
        <Version />
        <Status />
        <ProfileName to={config.profileId} profile={config.profile} />
        <ProfileName to={config.mutual_profileId} profile={config.mutual_profile} />
      </div>
      // @ts-ignore ignore missing property dispatchAction, not worth breaking up the props in Config component
      {!_.isEmpty(config.next) && expand_state[config.tree_id] && <Config config={config.next} />}
    </React.Fragment>
  )
}

Config = connect(null, { dispatchAction })(Config) as any
export { Config }