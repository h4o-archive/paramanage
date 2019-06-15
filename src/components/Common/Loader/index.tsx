import React from "react"
import { connect } from "react-redux"
import { Dimmer, Loader as SemanticLoader, Segment } from 'semantic-ui-react'

import { State } from "reducers"

type LoaderMapProps = {
  readonly active: boolean
}

const Loader: React.FunctionComponent<LoaderMapProps> = (props) => {
  return (
    <Segment hidden={!props.active}>
      <Dimmer active={props.active} style={{ position: "fixed", height: "100vh", width: "100vw" }}>
        <SemanticLoader>Updating data...</SemanticLoader>
      </Dimmer>
    </Segment>
  )
}

function mapStateToProps(state: State): LoaderMapProps {
  return {
    active: false
  }
}

const ConnectedLoader = connect<LoaderMapProps, {}, {}, State>(mapStateToProps)(Loader)
export { ConnectedLoader as Loader }