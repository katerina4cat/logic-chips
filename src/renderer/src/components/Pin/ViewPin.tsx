import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './ViewPin.module.scss'
import { Pin } from '@models/Pin'
import { STATE } from '@models/STATE'

interface Props {
  pin: Pin
  className?: string
  style?: React.CSSProperties
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
      style={{ backgroundColor: viewModel.viewProps.pin.stateColor, ...viewModel.viewProps.style }}
      className={[
        viewModel.viewProps.pin.totalStates[0] !== STATE.ERROR ? '' : 'errorFill',
        cl.Pin,
        viewModel.viewProps.className
      ].join(' ')}
    ></div>
  )
})

export default ViewPin
