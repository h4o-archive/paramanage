export type OverloadObject<T = any> = {
  [key: string]: T
}
export type Function = {
  (...args: any): any
}
export type OverloadOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>