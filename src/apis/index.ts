import axios, { AxiosInstance } from "axios";

import { _ } from "utils"
import { store } from "reducers"
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

  function notifyStartRequest(method: string, url: string, json: Readonly<_.type.Object>, api_call_id?: string): string {
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
    unfinish_api[method] = async <I>({ url, id, json, api_call_id }: APIparams<I>): Promise<typeof method extends "get" ? ResponseAPI<I> : _.type.Object> => {
      handleCache(method, url)
      api_call_id = notifyStartRequest(method, url, json, api_call_id)

      try {
        // @ts-ignore
        let result = call[parseUrl(url)][method](url, json)
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
  json?: Readonly<_.type.Object>,
  api_call_id?: string
}>

type API = {
  [methods in Exclude<keyof AxiosInstance, "get">]: ({ url, id, json, api_call_id }: APIparams) => Promise<any>
} & {
  get: <I>({ url, id, json, api_call_id }: APIparams<I>) => Promise<ResponseAPI<I>>
}