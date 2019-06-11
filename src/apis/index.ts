import axios, { AxiosInstance } from "axios";

import { _ } from "utils"
import { store } from "reducers"
import { START, FULLFILL, REJECT, QUEUE, RESET } from "actions/types"

function createApiInstance() {

  function createAxiosInstance(): AxiosInstance {
    let axios_instance = axios.create({
      baseURL: `${process.env.REACT_APP_LOCAL_HOST || "http://localhost"}:3003`
    })
    axios_instance.get = _.memoize(axios_instance.get)
    return axios_instance
  }

  function parseUrlToSubAPI(url: string): string {
    let result = url.match(/([^\/]+$)/)
    return result ? result[0] : "platform"
  }

  function handleCache(method: string, url: string): void {
    if (method !== "get") {
      store.dispatch({
        type: QUEUE.OUTDATED_REQUEST,
        payload: parseUrlToSubAPI(url)
      })
    } else {
      let outdated_requests = store.getState().loader_reducer.outdated_requests
      for (let key in outdated_requests) {
        // @ts-ignore
        call[key].get.clearCache()
      }
      store.dispatch({
        type: RESET.OUTDATED_REQUEST
      })
    }
  }

  function notifyStartRequest<I>({ method, url, id, params, json, api_call_id }: { method: string } & APIparams<I>): string {
    api_call_id = api_call_id || `${Math.random()}`
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

  const call: { readonly [key: string]: AxiosInstance } = {
    platform: createAxiosInstance(),
    version: createAxiosInstance(),
    environment: createAxiosInstance(),
    config: createAxiosInstance(),
    profile: createAxiosInstance(),
    category: createAxiosInstance(),
    parametre: createAxiosInstance()
  }

  let api: Readonly<API> = _.reduce(call.platform, (unfinish_api, method) => {
    unfinish_api[method] = async <I>({ url, id, params, json, api_call_id }: APIparams<I>): Promise<typeof method extends "get" ? ResponseAPI<I> : _.type.Object> => {
      handleCache(method, url)
      api_call_id = notifyStartRequest({ method, url, id, params, json, api_call_id })

      try {
        let constructed_url = constructURL({ method, url, id, params })
        // @ts-ignore
        let result = call[parseUrlToSubAPI(url)][method](constructed_url, json)
        notifyFullfillRequest(api_call_id)
        return result
      } catch (error) {
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
  platformId: string
}>

export type EnvironmentDB = PlatformDB

type DataAPI = PlatformDB | VersionDB | EnvironmentDB

export type ResponseAPI<I = null> = Readonly<{
  data: I extends string ? DataAPI : DataAPI[],
  [keys: string]: any
}>

type APIparams<I = undefined> = Readonly<{
  url: string,
  id?: I,
  params?: _.type.Object<string>
  json?: Readonly<_.type.Object>,
  api_call_id?: string
}>

type API = {
  [methods in Exclude<keyof AxiosInstance, "get">]: ({ url, id, json, api_call_id }: APIparams) => Promise<any>
} & {
  get: <I>({ url, id, json, api_call_id }: APIparams<I>) => Promise<ResponseAPI<I>>
}