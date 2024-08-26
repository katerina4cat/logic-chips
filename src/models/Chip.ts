import { makeObservable, observable } from 'mobx'
import { Pos } from './common/Pos'
import { ISavePin, Pin } from './Pin'
import { ISaveWire, Wire } from './Wire'
import { ChipType } from './ChipType'
import { generateNumberID } from './common/RandomId'

export class Chip {
  toSave = (): ISaveChip => ({
    title: this.title,
    color: this.color,
    subChips: this.subChips.map((chip) => chip.toSubSave()),
    inputs: this.inputs.map((pin) => pin.toSave()),
    outputs: this.outputs.map((pin) => pin.toSave()),
    wires: this.wires.map((wire) => wire.toSave())
  })
  toSubSave = (): ISaveSubChip => ({
    id: this.id,
    title: this.title,
    pos: this.pos,
    type: this.type
  })
  findPin = (chipID: number, pinID: number): Pin | undefined => {
    if (chipID === 0)
      return (
        this.inputs.find((pin) => pin.id === pinID) || this.outputs.find((pin) => pin.id === pinID)
      )
    return this.subChips.find((chip) => chip.id === chipID)?.findPin(0, pinID)
  }
  @observable
  title: string
  type: ChipType
  @observable
  color: string
  id: number

  @observable
  pos: Pos
  @observable
  inputs: Pin[] = []
  @observable
  outputs: Pin[] = []
  @observable
  subChips: Chip[] = []
  @observable
  wires: Wire[] = []

  constructor(
    title: string,
    type: ChipType = ChipType.CUSTOM,
    color: string,
    id: number = generateNumberID(),
    pos: Pos
  ) {
    this.title = title
    this.type = type
    this.color = color
    this.id = id
    this.pos = pos
    makeObservable(this)
  }
}

export interface ISaveSubChip {
  id: number
  title: string
  type: ChipType
  pos: { x: number; y: number }
  data?: any
}

export interface ISaveChip {
  title: string
  color: string
  subChips: ISaveSubChip[]
  inputs: ISavePin[]
  outputs: ISavePin[]
  wires: ISaveWire[]
  data?: any
}
