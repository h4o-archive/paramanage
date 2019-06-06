import axios from "axios";

import { _ } from "utils"
import { store } from "reducers"
import { START, END } from "actions/types"

let api = axios.create({
  baseURL: `${process.env.REACT_APP_LOCAL_HOST || "http://localhost"}:3003`
})
api.get = async (url: string) => {
  let api_cal_id: string = `${Math.random()}`
  store.dispatch({
    type: START.REQUEST,
    payload: api_cal_id
  })
  let result = await api.get(url)
  store.dispatch({
    type: END.REQUEST,
    payload: api_cal_id
  })
  return result
}
api.get = _.memoize(api.get)

export const json_api = api