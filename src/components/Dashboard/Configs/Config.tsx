import React from "react"
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
import { State } from "reducers";


type ConfigMapActions = {
  readonly dispatchAction: typeof dispatchAction
}

type ConfigOwnProps = Readonly<{
  config: ConfigProp,
  useParentState: () => { expand_state: Types.OverloadObject<boolean>, setExpandState: React.Dispatch<React.SetStateAction<Types.OverloadObject<boolean>>> }
}>
/**
 * @description 1 line of config information
 */
const Config: React.FunctionComponent<ConfigMapActions & ConfigOwnProps> = ({ config, ...props }) => {

  const { expand_state } = props.useParentState()

  const EditButton: React.FunctionComponent = () => {

    const action_payload = (_.isEmpty(config.next) || config.last === "") ? {
      label: config.version,
      config: { ...config, next: {} }
    } : {
        label: `${config.version} -> ${config.last}`,
        config: config
      }
    function onEditClick(): void {
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
        <ConfigVersion config={config} useParentState={props.useParentState} />
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
    const profile_style: React.CSSProperties = { textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", lineClamp: 2, lineHeight: "1em", maxHeight: "2em" }
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
      {!_.isEmpty(config.next) && expand_state[config.tree_id] && <ConnectedConfig config={config.next} useParentState={props.useParentState} />}
    </React.Fragment>
  )
}

const ConnectedConfig = connect<{}, ConfigMapActions, ConfigOwnProps, State>(null, { dispatchAction })(Config)
export { ConnectedConfig as Config }