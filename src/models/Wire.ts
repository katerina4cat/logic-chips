import { action, observable } from 'mobx'
import { Pos } from './common/Pos'
import { Pin } from './Pin'
import { Chip } from './Chip'
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
  accessor points: Pos[]
  from: [Chip, Pin]
  to: [Chip, Pin]
  type: WireTypes

  constructor(points: Pos[], from: [Chip, Pin], to: [Chip, Pin]) {
    this.points = points
    this.from = from
    this.to = to
    if (from[0].type === ChipType.BUS)
      if (to[0].type === ChipType.BUS) this.type = WireTypes.BUS_TO_BUS
      else this.type = WireTypes.BUS_TO_INPUT
    else if (to[0].type === ChipType.BUS) this.type = WireTypes.SOURCE_TO_BUS
    else this.type = WireTypes.DEFAULT

    if (this.type === WireTypes.BUS_TO_BUS) {
      ;(from[0] as BUSChip).linkBus(to[0] as BUSChip)
      return
    }
    to[1].linkPin(from[1])
  }

  breakWire = () => {
    if (this.type === WireTypes.BUS_TO_BUS) {
      ;(this.from[0] as BUSChip).unlinkBus(this.to[0] as BUSChip)
      return
    }
    this.to[1].unlinkPin(this.from[1])
  }
}

export interface ISaveWire {
  points: { x: number; y: number }
  fromChip: number
  fromPin: number
  toChip: number
  toPin: number
}
