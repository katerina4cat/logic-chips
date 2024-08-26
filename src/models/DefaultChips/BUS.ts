import { action, computed, makeObservable, observable, reaction } from 'mobx'
import { Chip, ISaveSubChip } from '../Chip'
import { ChipType, chipTypeInfo } from '../ChipType'
import { Pos } from '../common/Pos'
import { Pin } from '../Pin'
import { mergeStates, STATE } from '../STATE'
import { SIM_ERROR, SimulatingError } from '../common/SimulatingError'
import { generateNumberID } from '@models/common/RandomId'

export interface BusExtraData {
  type: number
  points: Pos[]
}

export class BUSChip extends Chip {
  @observable
  linkedBus: BUSChip[] = []
  override toSubSave = (): ISaveSubChip => ({
    id: this.id,
    title: this.title,
    type: this.type,
    pos: this.pos,
    data: { type: this.type, points: this.points }
  })
  points: Pos[] = []
  constructor(id: number = generateNumberID(), pos: Pos, extraData: BusExtraData) {
    super(
      chipTypeInfo[ChipType.BUS].title!,
      ChipType.BUS,
      chipTypeInfo[ChipType.BUS].color!,
      id,
      pos
    )
    this.points = extraData.points
    this.inputs.push(new Pin(0, this, 'STATE', extraData.type))
    this.outputs.push(new Pin(1, this, 'OUTSTATE', extraData.type, true))
    this.outputs[0].selfStates[0] = STATE.UNDEFINED
    reaction(() => this.inputs[0].totalStates, this.calculateLogic)
    makeObservable(this)
  }

  @computed
  get inputsStates() {
    return this.inputs[0].totalStates
  }

  getNearestBuses = (except: BUSChip = this) => {
    const res: BUSChip[] = [this]
    this.linkedBus.forEach((bus) => {
      if (bus !== except) res.push(...bus.getNearestBuses(this))
    })
    return res
  }

  @action
  calculateLogic = () => {
    let res = new Array(this.inputs[0].type).fill(STATE.UNDEFINED)
    this.getNearestBuses().forEach((bus) => {
      res = mergeStates(res, bus.inputsStates)
    })
    for (const bus of this.getNearestBuses()) bus.outputs[0].selfStates = res
  }

  linkInputPin = (pin: Pin) => {
    this.inputs[0].linkPin(pin)
  }
  unlinkInputPin = (pin: Pin) => {
    this.inputs[0].unlinkPin(pin)
  }
  @action
  linkBus = (bus: BUSChip) => {
    if (this.getNearestBuses().findIndex((findingBus) => findingBus === bus) !== -1)
      throw SimulatingError.warning(
        SIM_ERROR.WIRE_BUS_ALREADY_LINKED,
        'Эти шины уже связаны между собой!'
      )
    this.linkedBus.push(bus)
    bus.linkedBus.push(this)
    this.calculateLogic()
  }
  @action
  unlinkBus = (bus: BUSChip) => {
    let ind = this.linkedBus.findIndex((findingBus) => findingBus === bus)
    let ind2 = bus.linkedBus.findIndex((findingBus) => findingBus === this)
    this.linkedBus.splice(ind, 1)
    bus.linkedBus.splice(ind2, 1)
    this.calculateLogic()
    bus.calculateLogic()
  }
}
