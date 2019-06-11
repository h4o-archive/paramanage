import React from 'react'
import { Dropdown as SemanticDropdown, DropdownProps } from 'semantic-ui-react'
import { connect } from "react-redux"

import { SELECT, SET } from "actions/types"
import { fetchPlatforms, fetchVersions } from "./actions"
import { dispatchAction } from "components/actions"
import { _ } from "utils"
import { State } from 'reducers';
import { PlatformState } from './metadatas_reducer';

type PlatformProp = PlatformState & { value: string, text: string }

type PlatformsDropdownProps = {
  platforms: PlatformProp[],
  selected_platform: string,
  fetchPlatforms: typeof fetchPlatforms,
  dispatchAction: typeof dispatchAction,
  fetchVersions: typeof fetchVersions
}
/**
 * 
 * @description Platform Dropdown Selection Field on Home Page
 */
let PlatformsDropdown = class extends React.Component<PlatformsDropdownProps, {}> {
  constructor(props: PlatformsDropdownProps) {
    super(props);
    this.onChangePlatform = this.onChangePlatform.bind(this);
  }

  componentDidMount() {
    this.props.fetchPlatforms();
  }

  componentWillUnmount() {
    this.props.dispatchAction(SET.PREVIOUS_SELECTED)
  }

  onChangePlatform(event: React.SyntheticEvent, { value }: DropdownProps) {
    this.props.dispatchAction(SELECT.PLATFORM, value);
    this.props.fetchVersions();
  }

  render() {
    return (
      <SemanticDropdown
        fluid
        search
        selection
        options={this.props.platforms}
        onChange={this.onChangePlatform}
        value={this.props.selected_platform}
      />
    )
  }
}

function mapStateToProps(state: State) {
  let { data, selected } = state.metadatas_reducer.platforms
  return {
    platforms: _.map(data, item => ({ ...item, value: item.id, text: item.key }) as PlatformProp).sort(_.compareObjectAscendinBaseOnKey("order")),
    selected_platform: selected
  }
}

PlatformsDropdown = connect(mapStateToProps, { fetchPlatforms, fetchVersions, dispatchAction })(PlatformsDropdown) as any
export { PlatformsDropdown }