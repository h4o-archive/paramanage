import { combineReducers } from "redux"
import { reducer as form } from "redux-form"
import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools as composeEnhancer } from 'redux-devtools-extension';

import { metadatas_reducer } from "components/Dashboard/Metadatas/metadatas_reducer"
import { loader_reducer } from "components/Common/Loader/loader_reducer"
import { dashboard_add_modal_reducer } from "components/Dashboard/Add/dashboard_add_modal_reducer"
import { configs_reducer } from "components/Dashboard/Configs/configs_reducer"
import { parametres_reducer } from "components/Profile/Parametres.tsx/parametres_reducer"
// import { parametres_modal_reducer } from "components/Profile/Menu/ParametresModal/parametres_modal_reducer"
// import { edit_config_modal_reducer } from "components/Dashboard/Configs/EditConfigModal/edit_config_modal_reducer"

const combinedReducer = combineReducers({
  form,
  metadatas_reducer,
  loader_reducer,
  dashboard_add_modal_reducer,
  configs_reducer,
  parametres_reducer
  // parametres_modal_reducer,
  // edit_config_modal_reducer
})

export const store = createStore(combinedReducer, composeEnhancer(applyMiddleware(thunk)))
export type State = Readonly<ReturnType<typeof combinedReducer>>