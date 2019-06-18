import React, { useEffect } from "react"
import { connect } from "react-redux"
import { Form } from "semantic-ui-react"
import TextareaAutosize from "react-textarea-autosize"

import { fetchProfile } from "./actions"
import { toggleSelectMode } from "components/Profile/actions"
import { dispatchAction } from "components/actions"
import { SET } from "actions/types"
import { _ } from "utils"
import { State } from "reducers";
import { Category } from "./Category"
import { ParametresInCategory } from "./ParametresInCategory"

type ParametresMapProps = Readonly<{
  no_selected: boolean,
  profile_name: string
}>

type ParametresMapActions = Readonly<{
  fetchProfile: typeof fetchProfile,
  toggleSelectMode: typeof toggleSelectMode,
  dispatchAction: typeof dispatchAction
}>

type ParametresOwnProps = {
  readonly id: string
}

const Parametres: React.FunctionComponent<ParametresMapProps & ParametresMapActions & ParametresOwnProps> = ({ no_selected, profile_name, ...props }) => {

  useEffect(() => {
    console.log("use effect in Parametres")
    props.fetchProfile(props.id)
    if (no_selected) props.toggleSelectMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [no_selected])

  return (
    <div className="ui text container">

      <div className="ui header">
        <Form.Field
          control={TextareaAutosize}
          style={{ border: "none", fontSize: "1.5em", color: "grey", marginLeft: "1em", outline: "none", width: "90%" }}
          onChange={(e: any) => props.dispatchAction(SET.PROFILE_NAME, e.target.value)}
          value={profile_name}
        />
      </div>

      <div className="ui centered search header" style={{ fontSize: "1em" }}>
        <div className="ui icon input" style={{ width: "100vw" }}>
          <input className="prompt" type="text" placeholder="Search..." style={{ width: "100%" }} />
          <i className="search icon"></i>
        </div>
        <div className="results"></div>
      </div>

      <Category>
        <ParametresInCategory />
      </Category>

    </div>
  )
}

function mapStateToProps(state: State): ParametresMapProps {
  return {
    no_selected: _.isEmpty(state.parametres_reducer.selected),
    profile_name: state.parametres_reducer.profile.editable_key
  }
}

const ConnectedParametres = connect(mapStateToProps, { fetchProfile, dispatchAction, toggleSelectMode })(Parametres)

export { ConnectedParametres as Parametres }