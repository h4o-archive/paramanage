import React from "react"
import PropTypes from "prop-types"
import { connect, ConnectedComponentClass } from "react-redux"
import { Dimmer, Loader as SemanticLoader, Segment } from 'semantic-ui-react'

import { reducers_name, state } from "reducers"
const { LOADER_REDUCER } = reducers_name

type LoaderProps = {
  active: boolean
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
Loader.propTypes = {
  active: PropTypes.bool.isRequired
}

function mapStateToProps(state: state) {
  return {
    active: state[LOADER_REDUCER].loading
  }
}

Loader = connect(mapStateToProps)(Loader) as any
export { Loader }