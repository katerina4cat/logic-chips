export enum STATE {
  LOW,
  HIGHT,
  UNDEFINED,
  ERROR
}

interface StateInfo {
  color: (baseColor: string) => string
  title: string
}

export const stateInfo: { [key in STATE]: StateInfo } = {
  [STATE.LOW]: {
    color: (baseColor: string) => `color-mixin(${baseColor},#00000088)`,
    title: 'Низкий'
  },
  [STATE.HIGHT]: {
    color: (baseColor: string) => `color-mixin(${baseColor},#00000088)`,
    title: 'Высокий'
  },
  [STATE.UNDEFINED]: {
    color: (baseColor: string) => `color-mixin(${baseColor},#00000088)`,
    title: 'Неизвестный'
  },
  [STATE.ERROR]: {
    color: (baseColor: string) => `none`,
    title: 'Ошибочный'
  }
}

export const mergeState = (base: STATE, adding: STATE) => {
  if (base === STATE.UNDEFINED && adding === STATE.UNDEFINED) return STATE.UNDEFINED
  if (base === STATE.UNDEFINED && adding !== STATE.UNDEFINED) return adding
  if (adding === STATE.UNDEFINED && base !== STATE.UNDEFINED) return base
  return STATE.ERROR
}
