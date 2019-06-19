export const PARAMETRES_MODAL_STATE = {
  ADD: "add",
  EDIT: "edit",
  DELETE: "delete"
} as const

export const DASHBOARD_ADD_MODAL_STATE = {
  PLATFORM: "platform",
  VERSION: "version",
  ENVIRONMENT: "environment"
} as const

export const FORM_NAME = {
  DASHBOARD_ADD_MODAL: "DASBOARD_ADD",
  EDIT_ADD_MODAL: "EDIT_ADD",
  EDIT_CONFIG_MODAL: "EDIT_CONFIG"
} as const

export const COLOR = {
  GREY: "#8d94a0"
} as const

export const CONFIG_STATUS = {
  ACC: {
    key: "ACC",
    value: "ACC",
    text: "ACC",
    color: "green"
  },
  WAR: {
    key: "WAR",
    value: "WAR",
    text: "WAR",
    color: "yellow"
  },
  OBS: {
    key: "OBS",
    value: "OBS",
    text: "OBS",
    color: "red"
  }
} as const

export const SLEEP_TIME = 100 as const