import { action, computed, observable, reaction } from 'mobx'
import { Chip } from '../Chip'
import { ChipType, chipTypeInfo } from '../ChipType'
import { Pos } from '../common/Pos'
import { Pin } from '../Pin'
import { mergeStates, STATE } from '../STATE'
import { ton } from '../test/common'

export class BUSChip extends Chip {
  @observable
  accessor linkedBus: BUSChip[] = []
  constructor(id: number, pos: Pos, type = 1) {
    super(
      chipTypeInfo[ChipType.BUS].title!,
      ChipType.BUS,
      chipTypeInfo[ChipType.BUS].color!,
      id,
      pos
    )
    this.inputs.push(new Pin(0, 'STATE', type))
    this.outputs.push(new Pin(1, 'OUTSTATE', type, true))
    reaction(() => this.inputs[0].totalStates, this.calculateLogic)
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
      throw 'Эти шины уже связаны вместе!'
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
