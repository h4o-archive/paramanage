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
import * as Types from "utils/Types"

type ParametresMapProps = Readonly<{
  selected: Readonly<Types.OverloadObject<boolean>>,
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

const Parametres: React.FunctionComponent<ParametresMapProps & ParametresMapActions & ParametresOwnProps> = ({ selected, profile_name, ...props }) => {

  useEffect(() => {
    props.fetchProfile(props.id)
    if (_.isEmpty(selected)) props.toggleSelectMode(false)
  }, [selected])

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
    selected: state.parametres_reducer.selected,
    profile_name: state.parametres_reducer.profile.editable_key
  }
}

const ConnectedParametres = connect(mapStateToProps, { fetchProfile, dispatchAction, toggleSelectMode })(Parametres)

export { ConnectedParametres as Parametres }