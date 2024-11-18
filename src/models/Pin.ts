import { action, computed, makeObservable, observable, reaction } from 'mobx'
import { Pos } from './common/Pos'
import { STATE, mergeState, stateInfo } from './STATE'
import { SIM_ERROR, SimulatingError } from './common/SimulatingError'
import { Color, COLORS, Colors } from './common/COLORS'
import { Chip } from './Chip'
import { generateNumberID } from './common/RandomId'

export class PinStateInfo {
  @observable
  title: string
  @observable
  colorName: COLORS
  constructor(title: string = 'Pin', colorName: COLORS = COLORS.red) {
    this.title = title
    this.colorName = colorName
    makeObservable(this)
  }
  @computed
  get color() {
    return Colors[this.colorName]
  }
}

export class Pin {
  toSave = (): ISavePin => ({
    y: this.pos.y,
    id: this.id,
    type: this.type,
    statesInfo: this.statesInfo
  })

  // Кол-во состояний
  @observable
  type: number
  id: number
  @observable
  pos: Pos
  @observable
  atChippos: Pos = new Pos()
  isSource: boolean
  chip: Chip
  @observable
  statesInfo: PinStateInfo[] = []
  @observable
  globalState: PinStateInfo

  @computed
  get globalPos() {
    return this.atChippos.add(this.chip.pos)
  }

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
    const x = new Array(Math.abs(this.type)).fill(STATE.UNDEFINED)
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
    if (this.type === 1) {
      if (stateInfo[this.totalStates[0]].color)
        return [stateInfo[this.totalStates[0]].color!(this.statesInfo[0].color)]
      else return [undefined]
    } else
      return this.totalStates.map((state, ind) => {
        if (stateInfo[state]?.color && this.statesInfo[ind + 1])
          return stateInfo[state].color!(this.statesInfo[ind + 1].color)
        return undefined
      })
  }

  constructor(
    id: number = generateNumberID(),
    chip: Chip,
    statesInfo: PinStateInfo[] = [],
    type: number = 1,
    isSource: boolean = false,
    pos: Pos = new Pos()
  ) {
    this.type = type
    this.id = id
    this.chip = chip
    this.pos = pos
    this.isSource = isSource
    this.statesInfo = statesInfo.map(
      (stateSave) => new PinStateInfo(stateSave.title, stateSave.colorName)
    )
    if (this.statesInfo.length !== (Math.abs(this.type) === 1 ? 1 : Math.abs(this.type) + 1))
      for (
        let i = this.statesInfo.length;
        i < (Math.abs(this.type) === 1 ? 1 : Math.abs(this.type) + 1);
        i++
      )
        this.statesInfo.push(new PinStateInfo('Pin'))
    this.globalState = this.statesInfo[0]
    if (this.isSource) this.selfStates = new Array(Math.abs(this.type)).fill(STATE.LOW)
    makeObservable(this)
    reaction(() => this.type, this.updateStatesByType)
  }
  updateStatesByType = () => {
    if (this.isSource)
      for (let i = 0; i < Math.abs(this.type - this.selfStates.length); i++)
        if (this.type > this.selfStates.length) {
          this.selfStates.push(STATE.LOW)
        } else {
          this.selfStates.pop()
        }
    const stInfoLen = Math.abs(this.statesInfo.length - (this.type === 1 ? 1 : this.type + 1))
    if (this.type + 1 !== this.statesInfo.length)
      if (this.type + 1 > this.statesInfo.length) {
        this.statesInfo.push(...new Array(stInfoLen).fill(new PinStateInfo()))
      } else {
        this.statesInfo.splice(this.statesInfo.length - stInfoLen)
      }
  }
}

export interface ISavePin {
  y: number
  id: number
  type: number
  statesInfo: PinStateInfo[]
}
