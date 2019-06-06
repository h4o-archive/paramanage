import axios from "axios";

import { _ } from "utils"

let api = axios.create({
  baseURL: `${process.env.REACT_APP_LOCAL_HOST || "http://localhost"}:3003`
})
api.get = _.memoize(api.get)

export const json_api = api