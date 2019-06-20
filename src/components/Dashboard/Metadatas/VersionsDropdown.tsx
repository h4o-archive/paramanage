import React from 'react'
import { Dropdown as SemanticDropdown, DropdownProps } from 'semantic-ui-react'
import { connect } from "react-redux"

import { _ } from "utils"
import { dispatchAction } from "components/actions"
import { SELECT } from "actions/types"
import { State } from 'reducers';
import { VersionState } from './metadatas_reducer';

type VersionProp = VersionState & Readonly<{ value: string, text: string }>

type VersionsDropdownMapProps = Readonly<{
  versions: VersionProp[],
  selected_version: string
}>

type VersionsDropdownMapActions = Readonly<{ dispatchAction: typeof dispatchAction }>
/**
 * @description React Component - Version Dropdown Selection Field on Home Page
 */
const VersionsDropdown: React.FunctionComponent<VersionsDropdownMapProps & VersionsDropdownMapActions> = ({ versions, selected_version, ...props }) => {

  function onChangeVersion(event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps): void {
    props.dispatchAction(SELECT.VERSION, value);
  }

  return (
    <SemanticDropdown
      fluid
      search
      selection
      options={versions}
      onChange={onChangeVersion}
      value={selected_version}
    />
  )
}

function mapStateToProps(state: State): VersionsDropdownMapProps {
  const { data, selected } = state.metadatas_reducer.versions
  return {
    versions: _.map(data, item => _.pick({ ...item, value: item.id, text: item.key }, ["id", "key", "order", "value", "text"])).sort(_.compareObjectDescendinBaseOnKey("order")),
    selected_version: selected
  }
}

const ConnectedVersionsDropdown = connect<VersionsDropdownMapProps, VersionsDropdownMapActions, {}, State>(mapStateToProps, { dispatchAction })(VersionsDropdown)
export { ConnectedVersionsDropdown as VersionsDropdown }