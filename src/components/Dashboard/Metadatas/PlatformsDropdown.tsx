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

type PlatformsDropdownMapProps = Readonly<{
  platforms: PlatformProp[],
  selected_platform: string
}>

type PlatformsDropdownMapActions = Readonly<{
  fetchPlatforms: typeof fetchPlatforms,
  dispatchAction: typeof dispatchAction,
  fetchVersions: typeof fetchVersions
}>
/**
 * 
 * @description Platform Dropdown Selection Field on Home Page
 */
const PlatformsDropdown: React.FunctionComponent<PlatformsDropdownMapProps & PlatformsDropdownMapActions> = ({ platforms, selected_platform, ...props }) => {

  useEffect(() => {
    props.fetchPlatforms()

    return function cleanUp() {
      props.dispatchAction(SET.PREVIOUS_SELECTED)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

function mapStateToProps(state: State): PlatformsDropdownMapProps {
  const { data, selected } = state.metadatas_reducer.platforms
  return {
    platforms: _.map(data, item => ({ ...item, value: item.id, text: item.key }) as PlatformProp).sort(_.compareObjectAscendinBaseOnKey("order")),
    selected_platform: selected
  }
}

const ConnectedPlatformsDropdown = connect<PlatformsDropdownMapProps, PlatformsDropdownMapActions, {}, State>(mapStateToProps, { fetchPlatforms, fetchVersions, dispatchAction })(PlatformsDropdown) as any
export { ConnectedPlatformsDropdown as PlatformsDropdown }