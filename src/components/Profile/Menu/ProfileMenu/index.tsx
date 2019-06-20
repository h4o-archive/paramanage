import React, { useRef } from "react";
import { connect } from "react-redux"

import { Button } from "components/Common/Button"
import { _ } from "utils"
import { updateProfile, importParametres } from "../actions"
import { dispatchAction } from "components/actions"
import { toggleSelectMode } from "components/Profile/actions"
import { SHOW } from "actions/types"
import { SelectMode } from "./SelectMode"
import { State } from "reducers";
import { PROFILE_MENU_MODAL_STATE } from "utils/const"

type TopMenuMapProps = {
  readonly nothing_selected: boolean
}

type TopMenuMapActions = Readonly<{
  updateProfile: typeof updateProfile,
  dispatchAction: typeof dispatchAction,
  importParametres: typeof importParametres
}>

const ProfileMenu: React.FunctionComponent<TopMenuMapProps & TopMenuMapActions> = ({ nothing_selected, ...props }) => {

  const file_explorer = useRef(null)

  function onClickAdd(): void {
    props.dispatchAction(SHOW.MODAL.PARAMETRES, PROFILE_MENU_MODAL_STATE.ADD)
  }

  function onClickEdit(): void {
    props.dispatchAction(SHOW.MODAL.PARAMETRES, PROFILE_MENU_MODAL_STATE.EDIT)
  }

  function onClickDelete(): void {
    props.dispatchAction(SHOW.MODAL.PARAMETRES, PROFILE_MENU_MODAL_STATE.DELETE)
  }

  let disabled = nothing_selected ? "disabled" : "";
  return (
    <div className="ui container" style={{ marginBottom: "7em" }}>
      <div className="ui top fixed menu">
        <div className="ui basic segment" style={{ width: "100%" }}>
          <div className="ui grid">
            <div className="two wide column">
              <Button onClick={props.updateProfile} icon="large blue hand peace outline" transparent />
            </div>
            <div className="fourteen wide right aligned column">
              <SelectMode />
              <Button onClick={onClickDelete} icon="large red trash" transparent btn={`${disabled}`} />
              <Button onClick={onClickEdit} icon="large black edit" transparent btn={`${disabled}`} />
              <Button onClick={onClickAdd} icon="large green plus" transparent />
              <Button onClick={() => (file_explorer.current as any).click()} icon="large blue cloud upload" transparent />
              <input type="file" onChange={props.importParametres} ref={file_explorer} accept=".csv,.json" style={{ display: "none" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state: State): TopMenuMapProps {
  return {
    nothing_selected: _.isEmpty(state.parametres_reducer.selected)
  }
}

const ConnectedProfileMenu = connect(mapStateToProps, { updateProfile, toggleSelectMode, dispatchAction, importParametres })(ProfileMenu);
export { ConnectedProfileMenu as ProfileMenu }