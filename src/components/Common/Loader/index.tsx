import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Dimmer, Loader as SemanticLoader, Segment } from 'semantic-ui-react'

import { State } from "reducers"
import { dispatchAction } from "components/actions"
import { store } from "reducers"
import { _ } from "utils"

type LoaderMapProps = {
  readonly active: boolean
}

const Loader: React.FunctionComponent<LoaderMapProps> = ({ active }) => {

  const [state_active, setActive] = useState(false)
  const [timeout_id, setTimeoutID] = useState(setTimeout(() => true, 1))

  useEffect(() => {
    clearTimeout(timeout_id)
    if (state_active && !active) {
      let new_timeout_id = setTimeout(() => {
        if (_.isEmpty(store.getState().loader_reducer.requests)) setActive(false)
      }, 300)
      setTimeoutID(new_timeout_id)
    } else if (state_active !== active) setActive(active)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  return (
    <Segment hidden={!state_active}>
      <Dimmer active={state_active} style={{ position: "fixed", height: "100vh", width: "100vw" }}>
        <SemanticLoader>Paramanaging ...</SemanticLoader>
      </Dimmer>
    </Segment>
  )

}

function mapStateToProps(state: State): LoaderMapProps {
  const { requests } = state.loader_reducer
  return {
    active: !_.isEmpty(requests)
  }
}

const ConnectedLoader = connect<LoaderMapProps, {}, {}, State>(mapStateToProps, { dispatchAction })(Loader)
export { ConnectedLoader as Loader }