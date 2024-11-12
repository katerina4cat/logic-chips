import { action, makeObservable, observable } from 'mobx'
import { Pos } from './common/Pos'
import { Pin } from './Pin'
import { ChipType } from './ChipType'
import { BUSChip } from './DefaultChips/BUS'
import { generateNumberID } from './common/RandomId'
import { ANDChip } from './DefaultChips/AND'
import { NOTChip } from './DefaultChips/NOT'

const enum WireTypes {
  DEFAULT,
  SOURCE_TO_BUS,
  BUS_TO_INPUT,
  BUS_TO_BUS
}
let wiresIDS = Date.now()

export class Wire {
  toSave = (): ISaveWire => ({
    points: this.points,
    fromChip: this.from.chip.id,
    fromPin: this.from.id,
    toChip: this.to.chip.id,
    toPin: this.to.id,
    id: this.id
  })
  @observable
  points: Pos[]
  from: Pin
  to: Pin
  id: number
  type: WireTypes
  completed = false

  constructor(
    points: Pos[],
    from: Pin,
    to: Pin,
    complete = false,
    id: number = generateNumberID()
  ) {
    this.id = id
    wiresIDS += 1
    this.points = points
    if (from.type === -1 && to.type !== -1) {
      from = new Pin(generateNumberID(), from.chip, undefined, to.type, from.isSource, from.pos)
      if (from.isSource) from.chip.outputs.push(from)
      else from.chip.inputs.push(from)
    }
    if (to.type === -1 && from.type !== -1) {
      to = new Pin(generateNumberID(), to.chip, undefined, from.type, to.isSource, to.pos)
      if (to.isSource) to.chip.outputs.push(to)
      else to.chip.inputs.push(to)
    }
    if (from.chip.type === ChipType.BUS)
      if (to.chip.type === ChipType.BUS) this.type = WireTypes.BUS_TO_BUS
      else this.type = WireTypes.BUS_TO_INPUT
    else if (to.chip.type === ChipType.BUS) this.type = WireTypes.SOURCE_TO_BUS
    else this.type = WireTypes.DEFAULT

    switch (this.type) {
      case WireTypes.SOURCE_TO_BUS:
        this.from = from
        this.to = to.chip.inputs[0]
        break
      case WireTypes.BUS_TO_INPUT:
        this.from = to.chip.outputs[0]
        this.to = from
        break
      case WireTypes.DEFAULT:
        if (from.isSource && !to.isSource) {
          this.from = from
          this.to = to
          break
        }
        if (to.isSource && !from.isSource) {
          this.from = to
          this.to = from
          points.reverse()
          break
        }
      default:
        this.from = from
        this.to = to
        break
    }

    if (complete) this.completeLink()
    makeObservable(this)
  }

  completeLink = () => {
    if (this.completed) return
    if (this.type === WireTypes.BUS_TO_BUS) {
      ;(this.from.chip as BUSChip).linkBus(this.to.chip as BUSChip)
      this.completed = true
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
  points: { x: number; y: number }[]
  fromChip: number
  fromPin: number
  toChip: number
  toPin: number
  id: number
}
