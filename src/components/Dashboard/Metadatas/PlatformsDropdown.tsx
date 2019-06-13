import React, { useEffect } from 'react'
import { Dropdown as SemanticDropdown, DropdownProps } from 'semantic-ui-react'
import { connect } from "react-redux"

import { SELECT, SET } from "actions/types"
import { fetchPlatforms, fetchVersions } from "./actions"
import { dispatchAction } from "components/actions"
import { _ } from "utils"
import { State } from 'reducers';
import { PlatformState } from './metadatas_reducer';

type PlatformProp = PlatformState & Readonly<{ value: string, text: string }>

type PlatformsDropdownProps = Readonly<{
  platforms: PlatformProp[],
  selected_platform: string,
  fetchPlatforms: typeof fetchPlatforms,
  dispatchAction: typeof dispatchAction,
  fetchVersions: typeof fetchVersions
}>
/**
 * 
 * @description Platform Dropdown Selection Field on Home Page
 */
let PlatformsDropdown: React.FunctionComponent<PlatformsDropdownProps> = ({ platforms, selected_platform, ...props }) => {

  useEffect(() => {
    props.fetchPlatforms()

    return function cleanUp() {
      props.dispatchAction(SET.PREVIOUS_SELECTED)
    }
  }, [])

  function onChangePlatform(event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps): void {
    props.dispatchAction(SELECT.PLATFORM, value);
    props.fetchVersions();
  }

  return (
    <SemanticDropdown
      fluid
      search
      selection
      options={platforms}
      value={selected_platform}
      onChange={onChangePlatform}
    />
  )
}

function mapStateToProps(state: State): Pick<PlatformsDropdownProps, "platforms" | "selected_platform"> {
  let { data, selected } = state.metadatas_reducer.platforms
  return {
    platforms: _.map(data, item => ({ ...item, value: item.id, text: item.key }) as PlatformProp).sort(_.compareObjectAscendinBaseOnKey("order")),
    selected_platform: selected
  }
}

PlatformsDropdown = connect(mapStateToProps, { fetchPlatforms, fetchVersions, dispatchAction })(PlatformsDropdown) as any
export { PlatformsDropdown }