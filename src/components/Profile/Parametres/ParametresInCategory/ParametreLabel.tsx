import React, { useContext, useState } from "react"
import { connect } from "react-redux"

import { dispatchAction } from "components/actions"
import { SELECT, DESELECT } from "actions/types"
import { _ } from "utils"
import { State } from "reducers";
import { ParametreDB } from "apis";
import { CategoryContext } from "../CategoryContext"
import { SelectedParametresState } from "../parametres_reducer";

type ParametreLabelMapProps = Readonly<{
  selected_parametres: SelectedParametresState,
  select_mode: boolean
}>

type ParametreLabelMapActions = {
  readonly dispatchAction: typeof dispatchAction
}

type ParametreLabelOwnProps = {
  readonly parametre: ParametreDB
}

const ParametreLabel: React.FunctionComponent<ParametreLabelMapProps & ParametreLabelMapActions & ParametreLabelOwnProps> = ({ selected_parametres, select_mode, parametre, ...props }) => {

  let { font_and_background_color: { color } } = useContext(CategoryContext)

  const [hover_id, setHoverID] = useState("0")

  function onEnterParametre(id: string): (event: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => void {
    return () => {
      setHoverID(id)
    }
  }

  function onLeaveParametre(): void {
    setHoverID("0")
  }

  function onSelectParametre(id: string): (event: React.MouseEvent<HTMLElement, MouseEvent>) => void {
    return function () {
      onLeaveParametre();
      props.dispatchAction(SELECT.PARAMETRE, id);
    }
  }

  function onDeSelectParametre(id: string): (event: React.MouseEvent<HTMLElement, MouseEvent>) => void {
    return function () {
      props.dispatchAction(DESELECT.PARAMETRE, id);
    }
  }

  if (selected_parametres[parametre.id]) {
    return (
      <label>
        <i onClick={onDeSelectParametre(parametre.id)} style={{ position: "relative", marginRight: "0.5em", backgroundColor: "white" }} className="circular green check icon"></i>
        <p style={{ display: "inline", color }}>{parametre.key}</p>
      </label>
    )
  } else if (!_.isEmpty(selected_parametres) || hover_id === parametre.id || select_mode) {
    return (
      <label onMouseLeave={onLeaveParametre}>
        <i onClick={onSelectParametre(parametre.id)} style={{ position: "relative", marginRight: "0.5em" }} className="grey check icon"></i>
        <p style={{ display: "inline", color }}>{parametre.key}</p>
      </label>
    )
  } else {
    return (
      <label>
        <p onMouseEnter={onEnterParametre(parametre.id)} style={{ display: "inline", color }}>{parametre.key}</p>
      </label>
    )
  }
}

function mapStateToProps(state: State): ParametreLabelMapProps {
  return {
    selected_parametres: state.parametres_reducer.selected,
    select_mode: state.parametres_reducer.select_mode
  }
}

const ConnectedParametreLabel = connect<ParametreLabelMapProps, ParametreLabelMapActions, ParametreLabelOwnProps, State>(mapStateToProps, { dispatchAction })(ParametreLabel)
export { ConnectedParametreLabel as ParametreLabel }