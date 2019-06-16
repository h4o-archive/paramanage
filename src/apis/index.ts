import axios, { AxiosInstance } from "axios";

import { _ } from "utils"
import { store } from "reducers"
import { START, FULLFILL, REJECT, QUEUE, RESET } from "actions/types"
import * as Types from "utils/Types"

function createApiInstance(): Readonly<API> {

  function createAxiosInstance(): AxiosInstance {
    let axios_instance = axios.create({
      baseURL: `${process.env.REACT_APP_LOCAL_HOST || "http://localhost"}:3003`
    })
    axios_instance.get = _.memoize(axios_instance.get)
    return axios_instance
  }

  function parseUrlToSubAPI(url: string): string {
    const result = url.match(/([^/]+$)/)
    return result ? result[0] : "platform"
  }

  function handleCache(method: string, url: string): void {
    if (method !== "get") {
      store.dispatch({
        type: QUEUE.OUTDATED_REQUEST,
        payload: parseUrlToSubAPI(url)
      })
    } else {
      const outdated_requests = store.getState().loader_reducer.outdated_requests
      if (!_.isEmpty(outdated_requests)) {
        for (let key in outdated_requests) {
          // @ts-ignore
          sub_api[key].get.clearCache()
        }
        store.dispatch({
          type: RESET.OUTDATED_REQUEST
        })
      }
    }
  }

  function notifyStartRequest<I>({ method, url, id, params, json, api_call_id }: { method: string } & APIparams<I>): string {
    api_call_id = api_call_id || `${_.createUniqueID()}`
    store.dispatch({
      type: START.REQUEST,
      payload: {
        method,
        url,
        id,
        params,
        json,
        api_call_id
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

  function constructURL<I>({ method, url, id, params }: { method: string } & APIparams<I>): string {
    let constructed_url = `${url}${id ? `/${id}` : ""}`
    if (method === "get" && params) {
      constructed_url = `${constructed_url}?`
      for (let key in params) {
        constructed_url = `${constructed_url}${key}=${params[key]}&`
      }
      if (constructed_url[constructed_url.length - 1] === "&") constructed_url.slice(0, -1)
    }
    return constructed_url
  }

  const sub_api = {
    platforms: createAxiosInstance(),
    versions: createAxiosInstance(),
    environments: createAxiosInstance(),
    configs: createAxiosInstance(),
    profiles: createAxiosInstance(),
    mutual_profiles: createAxiosInstance(),
    categorys: createAxiosInstance(),
    parametres: createAxiosInstance()
  } as const

  const api: Readonly<API> = _.reduce(sub_api.platforms, (unfinish_api, method) => {
    unfinish_api[method] = async <I>({ url, id, params, json, api_call_id }: APIparams<I>): Promise<typeof method extends "get" ? ResponseAPI<I> : Types.OverloadObject> => {
      api_call_id = notifyStartRequest({ method, url, id, params, json, api_call_id })
      handleCache(method, url)

      // console.log("TCL: Logging", new Date())
      // console.log("TCL: method", method)
      // console.log("TCL: url", url)
      // console.log("TCL: id", id)
      // console.log("TCL: params", params)
      // console.log("TCL: json", json)
      // console.log("TCL: api_call_id", api_call_id)

      try {
        const constructed_url = constructURL({ method, url, id, params })
        // console.log("TCL: constructed_url", constructed_url)
        // console.log("TCL: sub_api_key", parseUrlToSubAPI(url))
        // @ts-ignore
        const result = sub_api[parseUrlToSubAPI(url)][method](constructed_url, json)
        // console.log("TCL: result", result)
        notifyFullfillRequest(api_call_id)
        return result
      } catch (error) {
        console.error(error)
        notifyRejectRequest(api_call_id)
        return { data: [] }
      }
    }
  }, {} as API)

  return api
}

export const api = createApiInstance()

export type PlatformDB = Readonly<{
  id: string
  order: string,
  key: string
}>

export type VersionDB = Readonly<{
  id: string
  order: string,
  key: string,
  platformId: string,
  latest: boolean
}>

export type EnvironmentDB = PlatformDB

export type ConfigDB = Readonly<{
  platformId: string,
  versionId: string,
  environmentId: string,
  order: string,
  status: "ACC" | "WAR" | "OBS",
  version: string,
  mutual_profileId: string,
  profileId: string,
  id: string
}>

export type ProfileDB = Readonly<{
  id: string,
  key: string
}>

export type MutualProfileDB = ProfileDB

type DataAPI = PlatformDB | VersionDB | EnvironmentDB | ConfigDB | ProfileDB | MutualProfileDB

export type ResponseAPI<I = null> = Readonly<{
  data: I extends string ? DataAPI : DataAPI[],
  [keys: string]: any
}>

type APIparams<I = undefined> = Readonly<{
  url: string,
  id?: I,
  params?: Types.OverloadObject<string | number | boolean>
  json?: Readonly<Types.OverloadObject>,
  api_call_id?: string
}>

// NOT READ-ONLY because of initializing in creation phase above
type API = {
  [methods in Exclude<keyof AxiosInstance, "get">]: <I>({ url, id, json, api_call_id }: APIparams<I>) => Promise<any>
} & {
  get: <I>({ url, id, json, api_call_id }: APIparams<I>) => Promise<ResponseAPI<I>>
}