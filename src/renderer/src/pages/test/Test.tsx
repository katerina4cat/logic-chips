import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './Test.module.scss'
import '../edit/global.scss'
import { Pin } from '@models/Pin'
import { STATE } from '@models/STATE'
import ViewPin from '@renderer/components/Pin/ViewPin'
import { Wire } from '@models/Wire'
import { Chip } from '@models/Chip'
import { Pos } from '@models/common/Pos'
import { Colors } from '@models/common/COLORS'
import SidePin from '@renderer/components/Pin/SidePin'

interface Props {}

export class TestViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
    this.pin.selfStates[0] = STATE.HIGHT
    this.pin2.selfStates[0] = STATE.UNDEFINED
    new Wire([], [this.chip, this.pin], [this.chip, this.pin3], true)
  }
  chip = new Chip('', undefined, '', 0, new Pos())
  pin = new Pin(0, 'test', 1, true, undefined, Colors.indigo)
  pin1 = new Pin(1, 'test', 1, true)
  pin2 = new Pin(2, 'test', 1, true)
  pin3 = new Pin(2, 'test', 1, true)
}
const Test = view(TestViewModel)<Props>(({ viewModel }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ViewPin pin={viewModel.pin} />
      <ViewPin pin={viewModel.pin1} />
      <ViewPin pin={viewModel.pin2} />
      <ViewPin pin={viewModel.pin3} />
      <SidePin pin={viewModel.pin1} input selfState />
      <SidePin pin={viewModel.pin1} input={false} selfState />
    </div>
  )
})

export default Test
