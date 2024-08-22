import { makeObservable, observable } from 'mobx'
import { Pos } from './common/Pos'
import { Pin } from './Pin'
import { ChipType } from './ChipType'
import { BUSChip } from './DefaultChips/BUS'

const enum WireTypes {
  DEFAULT,
  SOURCE_TO_BUS,
  BUS_TO_INPUT,
  BUS_TO_BUS
}

export class Wire {
  @observable
  points: Pos[]
  from: Pin
  to: Pin
  type: WireTypes
  completed = false

  constructor(points: Pos[], from: Pin, to: Pin, complete = false) {
    this.points = points
    this.from = from
    this.to = to
    if (from.chip.type === ChipType.BUS)
      if (to.chip.type === ChipType.BUS) this.type = WireTypes.BUS_TO_BUS
      else this.type = WireTypes.BUS_TO_INPUT
    else if (to.chip.type === ChipType.BUS) this.type = WireTypes.SOURCE_TO_BUS
    else this.type = WireTypes.DEFAULT
    if (complete) this.completeLink()
    makeObservable(this)
  }

  completeLink = () => {
    if (this.completed) return
    if (this.type === WireTypes.BUS_TO_BUS) {
      ;(this.from.chip as BUSChip).linkBus(this.to.chip as BUSChip)
      return
    }
    this.to.linkPin(this.from)
    this.completed = true
  }

  breakWire = () => {
    if (this.type === WireTypes.BUS_TO_BUS) {
      ;(this.from.chip as BUSChip).unlinkBus(this.to.chip as BUSChip)
      return
    }
    this.to.unlinkPin(this.from)
  }
}

export interface ISaveWire {
  points: { x: number; y: number }
  fromChip: number
  fromPin: number
  toChip: number
  toPin: number
}
