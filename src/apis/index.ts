import axios, { AxiosInstance } from "axios";

import { _ } from "utils"
import { store } from "reducers"
import { START, FULLFILL, REJECT, QUEUE, RESET } from "actions/types"
import * as Types from "utils/Types"
import { MemoizedFunction } from "lodash";

function createApiInstance(): Readonly<API> {

  type MemoizedFunctionWithDispatchActionIntegrated = MemoizedFunction & { request: { method: string } & APIparams<string> }

  type MemoizeWithDispatchActionIntegrated = <T extends (...args: any) => any>(func: T, resolver?: (...args: any[]) => any) => T & MemoizedFunctionWithDispatchActionIntegrated

  function createAxiosInstance(): AxiosInstance {
    let axios_instance = axios.create({
      baseURL: `${process.env.REACT_APP_LOCAL_HOST || "http://localhost"}:3003`
    })

    axios_instance.get = (function (func, resolver) {
      if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
        throw new TypeError('Expected a function')
      }
      const memoized: MemoizedFunctionWithDispatchActionIntegrated = async function (this: any, ...args: any[]): Promise<any> {
        const key = resolver ? resolver.apply(this, args) : args[0]
        const cache = memoized.cache

        if (cache.has(key)) {
          return { result: cache.get(key), api_call_id: null }
        }
        const api_call_id = notifyStartRequest(memoized.request)
        try {
          const result = await func.apply(this, args)
          memoized.cache = cache.set(key, result) || cache
          return { result, api_call_id }
        } catch (error) {
          return { result: { error }, api_call_id }
        }
      }
      memoized.request = { method: "", url: "" } as { method: string } & APIparams<string>
      memoized.clearCache = () => {
        if (memoized.cache.clear) memoized.cache.clear()
      }
      memoized.cache = new Map()
      return memoized
    } as MemoizeWithDispatchActionIntegrated)(axios_instance.get)

    return axios_instance
  }

  function parseUrlToSubAPI(url: string): keyof typeof sub_api {
    const result = url.match(/([^/]+$)/)
    return (result ? (result[0] === "db" ? "platforms" : result[0]) : "platforms") as keyof typeof sub_api
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
      try {
        handleCache(method, url)
        const constructed_url = constructURL({ method, url, id, params })

        let result: any = {}
        if (method !== "get") {
          api_call_id = notifyStartRequest({ method, url, id, params, json, api_call_id });
          // @ts-ignore
          ({ result } = await sub_api[parseUrlToSubAPI(url)][method](constructed_url, json))
        } else {
          // @ts-ignore
          sub_api[parseUrlToSubAPI(url)][method].request = { method, url, id, params, json, api_call_id };
          // @ts-ignore
          ({ result, api_call_id } = await sub_api[parseUrlToSubAPI(url)][method](constructed_url, json))
          if (result.error) throw result.error
        }

        // console.log("TCL: Logging", new Date())
        // console.log("TCL: method", method)
        // console.log("TCL: url", url)
        // console.log("TCL: id", id)
        // console.log("TCL: params", params)
        // console.log("TCL: json", json)
        // console.log("TCL: api_call_id", api_call_id)

        // console.log("TCL: constructed_url", constructed_url)
        // console.log("TCL: sub_api_key", parseUrlToSubAPI(url))
        // console.log("TCL: result", result)
        if (api_call_id) notifyFullfillRequest(api_call_id)
        return result
      } catch (error) {
        if (method === "get" && id && error.response.status === 404) {
          if (api_call_id) notifyFullfillRequest(api_call_id)
        } else {
          console.error(error)
          if (api_call_id) notifyRejectRequest(api_call_id)
        }
        return { data: id ? {} as DataAPI : [] as DataAPI[], error }
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

export type CategoryDB = Readonly<{
  id: string,
  order: string,
  key: string,
  color: string
}>

export type ParametreDB = Readonly<{
  id: string,
  key: string,
  value: string,
  categoryId: string,
  profileId: string
}>

type DataAPI = PlatformDB | VersionDB | EnvironmentDB | ConfigDB | ProfileDB | MutualProfileDB | CategoryDB | ParametreDB

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