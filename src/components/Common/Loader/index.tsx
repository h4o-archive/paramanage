import React, { useState, useEffect } from "react"
import { connect } from "react-redux"
import { Dimmer, Loader as SemanticLoader, Segment } from 'semantic-ui-react'

import { State } from "reducers"
import { dispatchAction } from "components/actions"
import { store } from "reducers"

type LoaderMapProps = {
  readonly active: boolean
}

const Loader: React.FunctionComponent<LoaderMapProps> = ({ active }) => {

  const [state_active, setActive] = useState(false)
  const [timeout_id, setTimeoutID] = useState(setTimeout(() => true, 1))

  useEffect(() => {
    clearTimeout(timeout_id)
    if (state_active && !active) {
      const new_timeout_id = setTimeout(() => {
        if (!workAroundCheck(store.getState().loader_reducer.requests)) setActive(false)
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

// TODO WORK-AROUND WAITING FOR REJECT TREATMENT

function workAroundCheck(requests: any) {
  for (let key in requests) {
    if (requests[key].status === "START") return true
  }
  return false
}

function mapStateToProps(state: State): LoaderMapProps {
  return {
    active: workAroundCheck(state.loader_reducer.requests)
  }
}

const ConnectedLoader = connect<LoaderMapProps, {}, {}, State>(mapStateToProps, { dispatchAction })(Loader)
export { ConnectedLoader as Loader }