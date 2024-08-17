import { observable } from 'mobx'
import { Pos } from './common/Pos'
import { Pin } from './Pin'

export class Wire {
  @observable
  accessor points: Pos[]
  from: Pin
  to: Pin
  constructor(from: Pin, to: Pin, points: Pos[]) {
    this.from = from
    this.to = to
    this.points = points
  }
}

export interface ISaveWire {
  points: { x: number; y: number }
  fromChip: number
  fromPin: number
  toChip: number
  toPin: number
}
