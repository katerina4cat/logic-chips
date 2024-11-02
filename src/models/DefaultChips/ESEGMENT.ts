import { makeObservable } from 'mobx'
import { Chip } from '../Chip'
import { ChipType, chipTypeInfo } from '../ChipType'
import { Pos } from '../common/Pos'
import { Pin, PinStateInfo } from '../Pin'
import { generateNumberID } from '@models/common/RandomId'

export class ESEGMENTChip extends Chip {
  constructor(id: number = generateNumberID(), pos: Pos) {
    super(
      chipTypeInfo[ChipType.ESEGMENT].title!,
      ChipType.ESEGMENT,
      chipTypeInfo[ChipType.ESEGMENT].color!,
      id,
      pos
    )
    this.inputs.push(new Pin(0, this, [new PinStateInfo('A')], 1, false))
    this.inputs.push(new Pin(1, this, [new PinStateInfo('B')], 1, false))
    this.inputs.push(new Pin(2, this, [new PinStateInfo('C')], 1, false))
    this.inputs.push(new Pin(3, this, [new PinStateInfo('D')], 1, false))
    this.inputs.push(new Pin(4, this, [new PinStateInfo('E')], 1, false))
    this.inputs.push(new Pin(5, this, [new PinStateInfo('F')], 1, false))
    this.inputs.push(new Pin(6, this, [new PinStateInfo('G')], 1, false))
    makeObservable(this)
  }
}
