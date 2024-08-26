import { action, makeObservable, reaction } from 'mobx'
import { Chip } from '../Chip'
import { ChipType, chipTypeInfo } from '../ChipType'
import { Pos } from '../common/Pos'
import { Pin } from '../Pin'
import { STATE } from '../STATE'
import { generateNumberID } from '@models/common/RandomId'

export class TRISTATEChip extends Chip {
  constructor(id: number = generateNumberID(), pos: Pos) {
    super(
      chipTypeInfo[ChipType.TRISTATE].title!,
      ChipType.TRISTATE,
      chipTypeInfo[ChipType.TRISTATE].color!,
      id,
      pos
    )
    this.inputs.push(new Pin(0, this, 'D', 1, false))
    this.inputs.push(new Pin(1, this, 'E', 1, false))
    this.outputs.push(new Pin(2, this, 'R', 1, true))
    this.outputs[0].selfStates[0] = STATE.UNDEFINED
    this.inputs.forEach((inp) => reaction(() => inp.totalStates, this.calculateLogic))
    makeObservable(this)
  }
  @action
  calculateLogic = () => {
    const D = this.inputs[0].totalStates[0]
    const E = this.inputs[1].totalStates[0]
    if (E === STATE.ERROR) {
      this.outputs[0].selfStates[0] = STATE.ERROR
      return
    }
    if (E === STATE.HIGHT) {
      this.outputs[0].selfStates[0] = D
      return
    }
    this.outputs[0].selfStates[0] = STATE.UNDEFINED
  }
}
