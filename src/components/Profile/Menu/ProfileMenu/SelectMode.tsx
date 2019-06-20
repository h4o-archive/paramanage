import React from "react";
import { connect } from "react-redux"
import { Responsive } from "semantic-ui-react"

import { Button } from "components/Common/Button"
import { _, Types } from "utils"
import { toggleSelectMode } from "components/Profile/actions"
import { State } from "reducers";

type MobileSelectModeMapProps = Readonly<{
  selected_parametres: Readonly<Types.OverloadObject<boolean>>,
  select_mode: boolean
}>

type MobileSelectModeMapActions = {
  readonly toggleSelectMode: typeof toggleSelectMode
}

const MobileSelectMode: React.FunctionComponent<MobileSelectModeMapProps & MobileSelectModeMapActions> = ({ selected_parametres, select_mode, ...props }) => {
  if (_.isEmpty(selected_parametres)) {
    return (
      <Button
        onClick={() => props.toggleSelectMode(!select_mode)}
        icon={`large ${select_mode ? "green" : "grey"} check`}
        transparent
      />
    )
  } else return null
}

function mapStateToProps(state: State): MobileSelectModeMapProps {
  return {
    selected_parametres: state.parametres_reducer.selected,
    select_mode: state.parametres_reducer.select_mode
  }
}

const ConnectedMobileSelectMode = connect<MobileSelectModeMapProps, MobileSelectModeMapActions, {}, State>(mapStateToProps, { toggleSelectMode })(MobileSelectMode)

export const SelectMode: React.FunctionComponent = () => {
  return <Responsive {...Responsive.onlyMobile} as={ConnectedMobileSelectMode} />
}