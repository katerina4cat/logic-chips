import { observable } from 'mobx'
import { Pos } from './common/Pos'
import { ISavePin, Pin } from './Pin'
import { ISaveWire, Wire } from './Wire'

export const enum ChipType {
  DEFAULT,
  AND,
  NOT,
  TRISTATE,
  ESEGMENT,
  ADAPTER,
  BUS
}

export class Chip {
  title: string
  type: ChipType
  color: string
  id: number

  @observable
  accessor pos: Pos
  @observable
  accessor inputs: Pin[] = []
  @observable
  accessor outputs: Pin[] = []
  @observable
  accessor subChips: Chip[] = []
  @observable
  accessor wires: Wire[] = []

  constructor(
    title: string,
    type: ChipType = ChipType.DEFAULT,
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
