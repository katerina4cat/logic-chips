import { STATE, stateInfo } from '../STATE'

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const ton = (x: STATE) => stateInfo[x].title
