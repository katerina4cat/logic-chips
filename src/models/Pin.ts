import { action, computed, makeObservable, observable } from 'mobx'
import { Pos } from './common/Pos'
import { STATE, mergeState } from './STATE'

export class Pin {
  // Кол-во состояний
  @observable
  accessor type: number
  @observable
  accessor title: string
  id: number
  @observable
  accessor pos: Pos
  isSource: boolean

  // Связанные проводами пины
  @observable
  accessor linkedPin: Pin[] = []
  @action
  linkNewPin = (pin: Pin) => {
    if (this === pin) return false
    if (this.linkedPin.findIndex((fpin) => fpin === pin) !== -1) return false
    this.linkedPin.push(pin)
    return true
  }
  // Собственные состояния пина, для начальных точек взаимодействия
  @observable
  accessor selfStates: STATE[] = []

  @computed
  get totalStates(): STATE[] {
    const x = new Array(this.type).fill(STATE.UNDEFINED)
    if (this.selfStates.length !== 0)
      for (let i = 0; i < this.type; i++) x[i] = mergeState(x[i], this.selfStates[i])
    this.linkedPin.forEach((pin) => {
      if (pin.type === this.type) {
        const linkPinState = pin.totalStates
        for (let i = 0; i < this.type; i++) {
          x[i] = mergeState(x[i], linkPinState[i])
        }
      }
    })
    return x
  }

  constructor(
    id: number,
    title?: string,
    type: number = 1,
    isSource: boolean = false,
    pos: Pos = new Pos()
  ) {
    this.type = type
    this.title = title || ''
    this.id = id
    this.pos = pos
    this.isSource = isSource
    if (this.isSource) this.selfStates = new Array(this.type).fill(STATE.LOW)
  }
}

export interface ISavePin {
  title: string
  y: number
  id: number
  type: number
}
