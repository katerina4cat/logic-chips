import { action, computed, makeObservable, observable } from 'mobx'
import { Pos } from './common/Pos'
import { STATE, mergeState, stateInfo } from './STATE'
import { SIM_ERROR, SimulatingError } from './common/SimulatingError'
import { Color, Colors } from './common/COLORS'
import { Chip } from './Chip'

export class Pin {
  // Кол-во состояний
  @observable
  type: number
  @observable
  title: string
  @observable
  color: Color
  id: number
  @observable
  pos: Pos
  isSource: boolean
  chip: Chip

  // Связанные проводами пины
  @observable
  linkedPin: Pin[] = []
  @action
  linkPin = (pin: Pin) => {
    if (this === pin)
      throw SimulatingError.warning(
        SIM_ERROR.LINKING_SELF_PIN,
        'Невозможно связать пин с самим собой!'
      )
    if (this.type != pin.type)
      throw SimulatingError.warning(
        SIM_ERROR.LINKING_DIFFERENT_PIN,
        'Невозможно связать различные типы пинов!'
      )
    if (this.linkedPin.findIndex((fpin) => fpin === pin) !== -1)
      throw SimulatingError.warning(SIM_ERROR.LINK_SEARCH_PIN, 'Такая связь уже существует!')
    this.linkedPin.push(pin)
  }
  @action
  unlinkPin = (pin: Pin) => {
    if (this === pin)
      throw SimulatingError.warning(
        SIM_ERROR.LINKING_SELF_PIN,
        'Невозможно связать пин с самим собой!'
      )
    const ind = this.linkedPin.findIndex((fpin) => fpin === pin)
    if (ind === -1)
      throw SimulatingError.warning(SIM_ERROR.LINK_SEARCH_PIN, 'Невозможно найти связанный пин!')
    this.linkedPin.splice(ind, 1)
  }
  // Собственные состояния пина, для начальных точек взаимодействия
  @observable
  selfStates: STATE[] = []

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

  @computed
  get stateColor() {
    if (stateInfo[this.totalStates[0]].color)
      return stateInfo[this.totalStates[0]].color!(this.color)
    return undefined
  }

  constructor(
    id: number,
    chip: Chip,
    title?: string,
    type: number = 1,
    isSource: boolean = false,
    pos: Pos = new Pos(),
    color: Color = Colors.red
  ) {
    this.type = type
    this.title = title || ''
    this.id = id
    this.chip = chip
    this.pos = pos
    this.isSource = isSource
    this.color = color
    if (this.isSource) this.selfStates = new Array(this.type).fill(STATE.LOW)
    makeObservable(this)
  }
}

export interface ISavePin {
  title: string
  y: number
  id: number
  type: number
}
