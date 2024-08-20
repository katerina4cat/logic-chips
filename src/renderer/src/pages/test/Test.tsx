import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './Test.module.scss'
import '../edit/global.scss'
import { Pin } from '@models/Pin'
import { STATE } from '@models/STATE'
import ViewPin from '@renderer/components/Pin/ViewPin'

interface Props {}

export class TestViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
    this.pin.selfStates[0] = STATE.HIGHT
  }
  pin = new Pin(0, 'test', 1, true)
}
const Test = view(TestViewModel)<Props>(({ viewModel }) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ViewPin pin={viewModel.pin} />
    </div>
  )
})

export default Test
