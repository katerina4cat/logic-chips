import { Color } from './common/COLORS'

export enum STATE {
  LOW,
  HIGHT,
  UNDEFINED,
  ERROR
}

interface StateInfo {
  color?: (color: Color) => string
  title: string
}

export const stateInfo: { [key in STATE]: StateInfo } = {
  [STATE.LOW]: {
    color: (color) => `color-mix(in srgb, ${color.color} 25%, #000)`,
    title: 'Низкий'
  },
  [STATE.HIGHT]: {
    color: (color) => `color-mix(in srgb, ${color.color} 95%, #000)`,
    title: 'Высокий'
  },
  [STATE.UNDEFINED]: {
    color: () => '#000',
    title: 'Неизвестный'
  },
  [STATE.ERROR]: {
    color: (color) => color.color,
    title: 'Ошибочный'
  }
}

export const mergeState = (base: STATE, adding: STATE) => {
  if (base === STATE.UNDEFINED && adding === STATE.UNDEFINED) return STATE.UNDEFINED
  if (base === STATE.UNDEFINED && adding !== STATE.UNDEFINED) return adding
  if (adding === STATE.UNDEFINED && base !== STATE.UNDEFINED) return base
  return STATE.ERROR
}

export const mergeStates = (base: STATE[], adding: STATE[]) => {
  if (base.length !== adding.length) throw 'Размер базовых и добавляемых состояний различен!'
  return base.map((baseState, i) => mergeState(baseState, adding[i]))
}
