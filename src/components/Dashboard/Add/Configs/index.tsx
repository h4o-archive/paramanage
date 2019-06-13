import React, { useContext } from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import { Dropdown } from "semantic-ui-react"

import { _ } from "utils"
import { fetchConfigs } from "./actions"
import { dispatchAction } from "components/actions"
import { SHOW } from "actions/types"
import { Button } from "components/Common/Button"
import { CONFIG_STATUS } from "utils/const"
import { ConfigContext } from "./ConfigContext"
import { ConfigState } from "./configs_reducer";

type ConfigProps = Readonly<{
  config: ConfigState,
  onEditClick: _.type.Function
}>
/**
 * @description 1 line of config information
 */
const Config: React.FunctionComponent<ConfigProps> = ({ config, onEditClick, children: ConfigVersion }) => {

  function EditButton() {
    return (
      <Dropdown icon='ellipsis vertical' floating button className='icon' style={{ backgroundColor: "rgba(0,0,0,0)", width: "2.9em", marginRight: "-1em" }}>
        <Dropdown.Menu style={{ right: "auto", left: "0" }}>
          <Dropdown.Item onClick={onEditClick(config)}>Edit</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  function Version() {
    return (
      <div className="middle aligned column" style={{ color: "white" }}>
        <ConfigContext.Provider value={{ config }}>
          {ConfigVersion}
        </ConfigContext.Provider>
      </div>
    )
  }

  function Status() {
    return (
      <div className="middle aligned column" >
        <p style={{ textAlign: "left", color: CONFIG_STATUS[config.status as keyof typeof CONFIG_STATUS].color }}>{config.status}</p>
      </div>
    )
  }

  function ProfileName(props: { to: string, profile: string }) {
    let profile_style: React.CSSProperties = { textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", lineClamp: 2, lineHeight: "1em", maxHeight: "2em" }
    return (
      <Link className="middle aligned column" to={`/profile/${props.to}`} style={profile_style}>{props.profile}</Link>
    )
  }

  return (
    <div className="row">
      <EditButton />
      <Version />
      <Status />
      <ProfileName to={config.profileId} profile={config.profile} />
      <ProfileName to={config.mutual_profileId} profile={config.mutual_profile} />
    </div>
  )
}

type ConfigVersionProps = Readonly<{
  version_style: React.CSSProperties,
  expand: Readonly<_.type.Object<boolean>>
}>
/**
 * @description React Component - the version information of config
 */
const ConfigVersion: React.FunctionComponent<ConfigVersionProps> = ({ version_style, expand, ...props }) => {
  let { config } = useContext(ConfigContext)

  function VersionIndicator({ text }) {
    return (
      <span style={version_style}>
        {text}
      </span>
    )
  }
  VersionIndicator.propTypes = {
    text: PropTypes.string.isRequired
  }

  if (config.plage.length > 0) {
    return (
      <React.Fragment>

        <VersionIndicator text={config.plage[0].version} />
        <i className="arrow right black icon" style={{ float: "left", marginTop: "0.5em", marginBottom: "0.5em" }}></i>
        <VersionIndicator text={config.plage[config.plage.length - 1].version} />
        <Button icon={`angle ${!expand[config.expand_key] ? "down" : "up"} grey icon`} style={{ float: "left" }} onClick={props.onPlageClick(config.expand_key)} transparent />

      </React.Fragment>
    )
  } else {
    return <VersionIndicator text={config.version} />
  }
}
ConfigVersion.propTypes = {
  version_style: PropTypes.object.isRequired,
  expand: PropTypes.object.isRequired
}

/**
 * @description React Component - header of the table of configs
 */
function TableHeader(props) {
  return (
    <div {...props}>
      <div className="left aligned column">
        <h3 className="ui header">Range of version</h3>
      </div>
      <div className="left aligned column">
        <h3 className="ui header">Status</h3>
      </div>
      <div className="left aligned column">
        <h3 className="ui header">Specific profile</h3>
      </div>
      <div className="left aligned column">
        <h3 className="ui header">Mutual profile</h3>
      </div>
    </div>
  )
}

/**
 * @description React Component - table of configs
 */
let Configs = class extends React.Component {

  constructor(props) {
    super(props)
    this.state = { expand: {} }
    this.onPlageClick = this.onPlageClick.bind(this)
    this.onEditClick = this.onEditClick.bind(this)
  }

  componentDidUpdate(prevProps) {
    let { selected_version, selected_platform, selected_environment } = this.props
    if (selected_version !== 0 && selected_platform !== 0 && selected_environment !== 0) {
      if (selected_version !== prevProps.selected_version || selected_platform !== prevProps.selected_platform ||
        selected_environment !== prevProps.selected_environment) {
        this.props.fetchConfigs(selected_platform, selected_version, selected_environment)
      }
    }
  }

  onPlageClick(expand_key) {
    return () => {
      this.setState({ expand: { ...this.state.expand, [expand_key]: !this.state.expand[expand_key] } })
    }
  }

  onEditClick(config) {
    let action_payload = _.isEmpty(config.plage) ? {
      label: config.version,
      config_or_plage: [config]
    } : {
        label: `${config.plage[0].version} -> ${config.plage[config.plage.length - 1].version}`,
        config_or_plage: [config.plage]
      }
    return () => {
      this.props.dispatchAction(SHOW.MODAL.EDIT_CONFIG, action_payload)
    }
  }

  render() {
    return (
      <div className="ui centered equal width grid" style={{ height: "80%" }}>

        <TableHeader className="row" style={{ marginTop: "3em", marginLeft: "2em" }} />
        <div className="ui divider"></div>

        {this.props.data.map(config => {

          let version_style = { backgroundColor: "rgb(5, 174, 252)", padding: "0.5em 0.5em 0.5em 0.5em", borderRadius: "0.5em 0.5em 0.5em 0.5em", float: "left" }

          return (
            <React.Fragment key={config.id}>
              <Config config={config} onEditClick={this.onEditClick}>
                <ConfigVersion version_style={version_style} onPlageClick={this.onPlageClick} {...this.state} />
              </Config>
              {
                this.state.expand[config.expand_key] &&
                config.plage.map(config_in_plage => {
                  return (
                    <Config key={config_in_plage.id} config={config_in_plage} onEditClick={this.onEditClick}>
                      <ConfigVersion version_style={{ ...version_style, backgroundColor: "grey" }} {...this.state} />
                    </Config>
                  )
                })
              }
            </React.Fragment>
          )

        })}

      </div>
    )
  }
}
Configs.propTypes = {
  selected_platform: PropTypes.string.isRequired,
  selected_version: PropTypes.string.isRequired,
  selected_environment: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired
}

function getMakeLabel({ selected_platform, selected_version, selected_environment }) {
  return (label) => `${selected_platform}${selected_version}${selected_environment}${label}`
}

/**
 * @typedef {Object} config
 * @property {Array} plage all config with similar status and profiles with this config
 * @property {string} expand_key key using to map to state to know if display all the config in the plage
 * with others property in redux-state
 */

/**
 * 
 * @return {{data: config[],selected_platform: string, selected_version: string, selected_environment: string}}
 */
function mapStateToProps(state) {
  let { platforms, versions, environments } = state[METADATAS_REDUCER]
  let selected_platform = platforms.selected
  let selected_version = versions.selected
  let selected_environment = environments.selected
  let makeLabel = getMakeLabel({ selected_platform, selected_version, selected_environment })

  let raw_data = Object.values(state[CONFIGS_REDUCER].configs).sort(_.compareObjectDescendinBaseOnKey("order"))

  let plage = []
  let data = raw_data.reduce((filtered_raw_data, config, index) => {
    if (raw_data[index + 1] && config.profileId === raw_data[index + 1].profileId && config.status === raw_data[index + 1].status) {
      if (_.isEmpty(plage)) plage.push({ ...config, plage: [] })
      plage.push({ ...raw_data[index + 1], plage: [] })
    } else if (!_.isEmpty(plage)) {
      filtered_raw_data.push({ ...config, plage, expand_key: makeLabel(`${plage[0].version}${plage[plage.length - 1].version}`) })
      plage = []
    } else {
      filtered_raw_data.push({ ...config, plage: [], expand_key: "" })
    }
    return filtered_raw_data
  }, [])

  return {
    selected_platform,
    selected_version,
    selected_environment,
    data
  }
}

Configs = connect(mapStateToProps, { dispatchAction, fetchConfigs })(Configs)
export { Configs }