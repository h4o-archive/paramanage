export function dispatchAction(type: string, payload: any) {
  return {
    type,
    payload
  }
}