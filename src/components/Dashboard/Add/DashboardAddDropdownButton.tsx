import React from 'react'
import { connect } from "react-redux"

import { dispatchAction } from "components/actions"
import { SHOW } from "actions/types"
import { _ } from "utils"
import { DropdownButton } from "components/Common/DropdownButton"
import { DropdownItemProps } from 'semantic-ui-react';
import { State } from 'reducers';

type ButtonItem = Readonly<{
  text: string,
  value: string,
  shouldDisplay: ((condition: boolean) => boolean) | undefined
}>

type DashboardAddDropdownButtonProps = Readonly<{
  button_items: ButtonItem[],
  platforms_is_empty: boolean,
  dispatchAction: typeof dispatchAction
}>
/**
 * @description Add Button Dropdown on Home Page
 */
let DashboardAddDropdownButton: React.FunctionComponent<DashboardAddDropdownButtonProps> = ({ button_items, platforms_is_empty, ...props }) => {

  function shouldItemDisplay(item: ButtonItem): boolean {
    return item.shouldDisplay ? item.shouldDisplay(platforms_is_empty) : true
  }

  function onClickOnItem(event: React.MouseEvent<HTMLDivElement, MouseEvent>, { value }: DropdownItemProps): void {
    props.dispatchAction(SHOW.MODAL.DASHBOARD_ADDING, value)
  }

  return (
    <DropdownButton
      text='Add'
      icon='plus'
      button_style={{ backgroundColor: "green", color: "white" }}
      dropdown_style={{ right: "0", left: "auto" }}
      {...{ button_items, shouldItemDisplay, onClickOnItem }}
    />
  )
}

function mapStateToProps(state: State): Pick<DashboardAddDropdownButtonProps, "button_items" | "platforms_is_empty"> {
  let __button_items_in_state__ = state.dashboard_add_modal_reducer.data
  let button_items = _.map(__button_items_in_state__, button_item => (
    {
      text: button_item.key.charAt(0).toUpperCase() + button_item.key.slice(1),
      value: button_item.key,
      shouldDisplay: button_item.shouldDisplay
    }
  ))
  return {
    button_items,
    platforms_is_empty: _.isEmpty(state.metadatas_reducer.platforms.data)
  }
}

DashboardAddDropdownButton = connect(mapStateToProps, { dispatchAction })(DashboardAddDropdownButton) as any
export { DashboardAddDropdownButton }