import { ViewModel, view } from '@yoskutik/react-vvm'
import { makeObservable } from 'mobx'
import cl from './ViewPin.module.scss'
import { Pin } from '@models/Pin'
import { stateInfo } from '@models/STATE'

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
    <circle
      style={{ fill: viewModel.viewProps.pin.stateColor }}
      className={[viewModel.viewProps.pin.stateColor ? 'errorFill' : '', cl.Pin].join(' ')}
    ></circle>
  )
})

export default ViewPin
