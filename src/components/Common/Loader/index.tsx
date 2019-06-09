import React from "react"
import { connect, ConnectedComponentClass } from "react-redux"
import { Dimmer, Loader as SemanticLoader, Segment } from 'semantic-ui-react'

import { reducers_name, State } from "reducers"
const { LOADER_REDUCER } = reducers_name

type LoaderProps = {
  readonly active: boolean
}
let Loader: React.FunctionComponent<LoaderProps> = (props) => {
  return (
    <Segment hidden={!props.active}>
      <Dimmer active={props.active} style={{ position: "fixed", height: "100vh", width: "100vw" }}>
        <SemanticLoader>Updating data...</SemanticLoader>
      </Dimmer>
    </Segment>
  )
}

function mapStateToProps(state: State): LoaderProps {
  return {
    active: state[LOADER_REDUCER].loading
  }
}

Loader = connect(mapStateToProps)(Loader) as any
export { Loader }