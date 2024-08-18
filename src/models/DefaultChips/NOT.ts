import { action, reaction } from 'mobx'
import { Chip } from '../Chip'
import { ChipType, chipTypeInfo } from '../ChipType'
import { Pos } from '../common/Pos'
import { Pin } from '../Pin'
import { STATE } from '../STATE'

export class NOTChip extends Chip {
  constructor(id: number, pos: Pos) {
    super(
      chipTypeInfo[ChipType.NOT].title!,
      ChipType.NOT,
      chipTypeInfo[ChipType.NOT].color!,
      id,
      pos
    )
    this.inputs.push(new Pin(0, 'A', 1, false))
    this.outputs.push(new Pin(1, 'R', 1, true))
    this.inputs.forEach((inp) => reaction(() => inp.totalStates, this.calculateLogic))
  }

  @action
  calculateLogic = () => {
    const A = this.inputs[0].totalStates[0]
    if (A === STATE.ERROR) {
      this.outputs[0].selfStates[0] = STATE.ERROR
      return
    }
    if (A === STATE.HIGHT) {
      this.outputs[0].selfStates[0] = STATE.LOW
      return
    }
    this.outputs[0].selfStates[0] = STATE.HIGHT
  }
}
