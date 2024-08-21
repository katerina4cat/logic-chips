import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import cl from './SidePin.module.scss'
import { Pin } from '@models/Pin'
import ViewPin from './ViewPin'
import { STATE } from '@models/STATE'

interface Props {
  pin: Pin
  input: boolean
  selfState?: true
}

export class SidePinViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }
  @action
  changeState = () => {
    this.viewProps.pin.selfStates[0] =
      this.viewProps.pin.selfStates[0] === STATE.LOW ? STATE.HIGHT : STATE.LOW
  }
}
const SidePin = view(SidePinViewModel)<Props>(({ viewModel }) => {
  return (
    <div
      className={cl.SidePin}
      style={{ flexDirection: viewModel.viewProps.input ? 'row' : 'row-reverse' }}
    >
      <div className={cl.Scroll}></div>
      <div
        className={cl.StatusBtn}
        onClick={viewModel.viewProps.selfState && viewModel.changeState}
        style={{ backgroundColor: viewModel.viewProps.pin.stateColor }}
      ></div>
      <div
        className={cl.Line}
        style={{ transform: `translateX(${viewModel.viewProps.input ? -0.15 : 0.15}em)` }}
      ></div>
      <ViewPin
        pin={viewModel.viewProps.pin}
        style={{ transform: `translateX(${viewModel.viewProps.input ? -0.2 : 0.2}em)` }}
      />
    </div>
  )
})

export default SidePin
