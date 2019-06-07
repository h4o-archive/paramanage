import { combineReducers } from "redux"
import { reducer as form } from "redux-form"
import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools as composeEnhancer } from 'redux-devtools-extension';

import { _ } from "utils"
import { metadatas_reducer } from "components/Dashboard/Metadatas/metadatas_reducer"
import { loader_reducer } from "components/Common/Loader/loader_reducer"
// import { configs_reducer } from "components/Dashboard/Configs/configs_reducer"
// import { dashboard_add_modal_reducer } from "components/Dashboard/Add/dashboard_add_modal_reducer"
// import { parametres_reducer } from "components/Profile/Parametres/parametres_reducer"
// import { parametres_modal_reducer } from "components/Profile/Menu/ParametresModal/parametres_modal_reducer"
// import { edit_config_modal_reducer } from "components/Dashboard/Configs/EditConfigModal/edit_config_modal_reducer"

let all: { [key: string]: _.type.func } = {
  form,
  metadatas_reducer,
  loader_reducer,
  // configs_reducer,
  // dashboard_add_modal_reducer,
  // parametres_reducer,
  // parametres_modal_reducer,
  // edit_config_modal_reducer
}

let reducers_name: { [key: string]: string } = _.mapObject(all, (unfinish_reducers_name, key) => {
  unfinish_reducers_name[key.toUpperCase()] = all[key].name
})

export const store = createStore(combineReducers(all), composeEnhancer(applyMiddleware(thunk)))
export { reducers_name }
export type state = {
  [key: string]: any
}