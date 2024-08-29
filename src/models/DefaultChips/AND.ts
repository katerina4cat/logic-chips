import { action, makeObservable, reaction } from 'mobx'
import { Chip } from '../Chip'
import { ChipType, chipTypeInfo } from '../ChipType'
import { Pos } from '../common/Pos'
import { Pin } from '../Pin'
import { STATE } from '../STATE'
import { generateNumberID } from '@models/common/RandomId'
import { ton } from '@models/test/common'

export class ANDChip extends Chip {
  constructor(id: number = generateNumberID(), pos: Pos) {
    super(
      chipTypeInfo[ChipType.AND].title!,
      ChipType.AND,
      chipTypeInfo[ChipType.AND].color!,
      id,
      pos
    )
    this.inputs.push(new Pin(0, this, 'A', 1, false))
    this.inputs.push(new Pin(1, this, 'B', 1, false))
    this.outputs.push(new Pin(2, this, 'R', 1, true))
    makeObservable(this)
    this.inputs.forEach((inp) =>
      reaction(() => inp.totalStates, this.calculateLogic, { fireImmediately: true })
    )
  }

  @action
  calculateLogic = () => {
    const A = this.inputs[0].totalStates[0]
    const B = this.inputs[1].totalStates[0]
    if (A === STATE.ERROR || B === STATE.ERROR) {
      this.outputs[0].selfStates[0] = STATE.ERROR
      return
    }
    if (A === STATE.HIGHT && B === STATE.HIGHT) {
      this.outputs[0].selfStates[0] = STATE.HIGHT
      return
    }
    this.outputs[0].selfStates[0] = STATE.LOW
  }
}
