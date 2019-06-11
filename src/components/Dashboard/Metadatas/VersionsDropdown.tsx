import React from 'react'
import { Dropdown as SemanticDropdown, DropdownProps } from 'semantic-ui-react'
import { connect } from "react-redux"

import { _ } from "utils"
import { dispatchAction } from "components/actions"
import { SELECT } from "actions/types"
import { State } from 'reducers';
import { VersionState } from './metadatas_reducer';

type VersionProp = VersionState & { value: string, text: string }

type VersionsDropdownProps = {
  versions: VersionProp[],
  selected_version: string,
  dispatchAction: typeof dispatchAction,
}
/**
 * @description React Component - Version Dropdown Selection Field on Home Page
 */
let VersionsDropdown: React.FunctionComponent<VersionsDropdownProps> = (props) => {

  function onChangeVersion(event: React.SyntheticEvent<HTMLElement, Event>, { value }: DropdownProps) {
    props.dispatchAction(SELECT.VERSION, value);
  }

  return (
    <SemanticDropdown
      fluid
      search
      selection
      options={props.versions}
      onChange={onChangeVersion}
      value={props.selected_version}
    />
  )
}

function mapStateToProps(state: State) {
  let { data, selected } = state.metadatas_reducer.versions
  return {
    versions: _.map(data, item => _.pick({ ...item, value: item.id, text: item.key }, ["id", "key", "order", "value", "text"])).sort(_.compareObjectAscendinBaseOnKey("order")),
    selected_version: selected
  }
}

VersionsDropdown = connect(mapStateToProps, { dispatchAction })(VersionsDropdown) as any
export { VersionsDropdown }