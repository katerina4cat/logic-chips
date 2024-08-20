import { action, observable } from 'mobx'
import { Pos } from './common/Pos'
import { ISavePin, Pin } from './Pin'
import { ISaveWire, Wire } from './Wire'
import { ChipType } from './ChipType'
import { SIM_ERROR, SimulatingError } from './common/SimulatingError'

export class Chip {
  title: string
  type: ChipType
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
    id: number,
    pos: Pos
  ) {
    this.title = title
    this.type = type
    this.color = color
    this.id = id
    this.pos = pos
  }
}

export interface ISaveChip {
  title: string
  type: ChipType
  color: string
  pos: { x: number; y: number }
  subChips: { id: number; title: string }[]
  inputs: ISavePin[]
  outputs: ISavePin[]
  wires: ISaveWire[]
  data?: any
}
