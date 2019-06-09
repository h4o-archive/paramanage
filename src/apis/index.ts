import axios, { AxiosInstance } from "axios";

import { _ } from "utils"
import { store, state } from "reducers"
import { START, FULLFILL, REJECT, QUEUE } from "actions/types"

function createApiInstance() {

  function createAxiosInstance(): AxiosInstance {
    let axios_instance = axios.create({
      baseURL: `${process.env.REACT_APP_LOCAL_HOST || "http://localhost"}:3003`
    })
    axios_instance.get = _.memoize(axios_instance.get)
    return axios_instance
  }

  function parseUrl(url: string): string {
    // TODO parse url
    return url
  }

  function handleCache(method: string, url: string): void {
    if (method !== "get") {
      store.dispatch({
        type: QUEUE.OUTDATED_REQUEST,
        payload: parseUrl(url)
      })
    } else {
      // @ts-ignore
      call[parseUrl(url)].get.clearCache()
    }
  }

  function notifyStartRequest(method: string, url: string, json: state, api_call_id?: string): string {
    api_call_id = api_call_id || `${Math.random()}`
    store.dispatch({
      type: START.REQUEST,
      payload: {
        id: api_call_id,
        method,
        params: [url, json, api_call_id]
      }
    })
    return api_call_id
  }

  function notifyFullfillRequest(api_call_id: string): void {
    store.dispatch({
      type: FULLFILL.REQUEST,
      payload: api_call_id
    })
  }

  function notifyRejectRequest(api_call_id: string): void {
    store.dispatch({
      type: REJECT.REQUEST,
      payload: api_call_id
    })
  }

  const call: { [key: string]: AxiosInstance } = {
    platform: createAxiosInstance(),
    version: createAxiosInstance(),
    environment: createAxiosInstance(),
    config: createAxiosInstance(),
    profile: createAxiosInstance(),
    category: createAxiosInstance(),
    parametre: createAxiosInstance()
  }

  type api = { [method: string]: _.type.func }
  let api: api = _.reduce(call.platform, (unfinish_api: api, method) => {
    unfinish_api[method] = async (url: string, json: state, api_call_id?: string): Promise<_.type.readonlyObject[] | string[] | _.type.readonlyObject> => {

      handleCache(method, url)
      api_call_id = notifyStartRequest(method, url, json, api_call_id)

      try {
        // @ts-ignore
        let result = call[parseUrl(url)][method](url, json)
        notifyFullfillRequest(api_call_id)
        return result
      } catch (error) {
        notifyRejectRequest(api_call_id)
        return []
      }
    }
  }, {})

  return api
}

export const api = createApiInstance()