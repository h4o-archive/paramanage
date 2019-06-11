import { AnyAction } from "redux"
import { ThunkAction } from "redux-thunk"

import { State } from "reducers"

export const ADD = {
  VERSION: "ADD_VERSION",
  PLATFORM: "ADD_PLATFORM",
  ENVIRONMENT: "ADD_ENVIRONMENT",
  CONFIG: "ADD_CONFIG"
} as const

export const DELETE = {
  VERSION: "DELETE_VERSION",
  PLATFORM: "DELETE_PLATFORM",
  ENVIRONMENT: "DELETE_ENVIRONMENT"
} as const

export const SELECT = {
  VERSION: "SELECT_VERSION",
  PLATFORM: "SELECT_PLATFORM",
  ENVIRONMENT: "SELECT_ENVIRONMENT",
  PARAMETRE: "SELECT_PARAMETRE",
} as const

export const DESELECT = {
  PARAMETRE: "DESELECT_PARAMETRE"
} as const

export const FETCH = {
  VERSIONS: "FETCH_VERSION",
  PLATFORMS: "FETCH_PLATFORMS",
  ENVIRONMENTS: "FETCH_ENVIRONMENTS",
  CONFIGS: "FETCH_CONFIGS",
  PROFILE: "FETCH_PROFILE",
  CATEGORYS: "FETCH_CATEGORYS"
} as const

export const SHOW = {
  MODAL: {
    DASHBOARD_ADDING: "SHOW_MODAL_DASHBOARD_ADDING",
    EDIT_CONFIG: "SHOW_MODAL_EDIT_CONFIG",
    PARAMETRES: "SHOW_MODAL_PARAMETRES",
  }
} as const

export const HIDE = {
  MODAL: {
    DASHBOARD_ADDING: "HIDE_MODAL_DASHBOARD_ADDING",
    EDIT_CONFIG: "HIDE_MODAL_EDIT_CONFIG",
    PARAMETRES: "HIDE_MODAL_PARAMETRES"
  }
} as const

export const ACTIVE = {
  SELECT_MODE: "ACTIVE_SELECT_MODE"
} as const

export const DEACTIVE = {
  SELECT_MODE: "DEACTIVE_SELECT_MODE"
} as const

export const TOGGLE = {
  SELECT_MODE: "TOGGLE_SELECT_MODE"
} as const

export const START = {
  REQUEST: "START_REQUEST"
} as const

export const FULLFILL = {
  REQUEST: "FULLFILL_REQUEST"
} as const

export const REJECT = {
  REQUEST: "REJECT_REQUEST"
} as const

export const SET = {
  TEMPO_PROFILE_NAME: "SET_TEMPO_PROFILE_NAME",
  PREVIOUS_SELECTED: "SET_PREVIOUS_SELECTED",
  COLOR: "SET_COLOR"
} as const

export const RESET = {
  COLOR: "RESET_COLOR",
  REQUEST_STATUS: "RESET_REQUEST_STATUS",
  OUTDATED_REQUEST: "RESET_OUTDATED_REQUEST"
} as const

export const QUEUE = {
  OUTDATED_REQUEST: "QUEUE_OUTDATED_REQUEST"
} as const

export type Action = {
  readonly type: string,
  readonly payload: any
}

export type ReduxThunk = ThunkAction<any, State, any, AnyAction>