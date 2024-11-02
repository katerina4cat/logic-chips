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
    this.inputs.push(new Pin(0, this, [new PinStateInfo('D')], 8, false))
    makeObservable(this)
  }
}
