import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './ViewPin.module.scss'
import { Pin } from '@models/Pin'
import { STATE } from '@models/STATE'

interface Props {
  pin: Pin
}

export class ViewPinViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
}
const ViewPin = view(ViewPinViewModel)<Props>(({ viewModel }) => {
  return (
    <div
      style={{ backgroundColor: viewModel.viewProps.pin.stateColor }}
      className={[
        viewModel.viewProps.pin.totalStates[0] !== STATE.ERROR ? '' : 'errorFill',
        cl.Pin
      ].join(' ')}
    ></div>
  )
})

export default ViewPin
