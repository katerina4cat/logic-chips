import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import cl from './SidePin.module.scss'
import { Pin } from '@models/Pin'
import ViewPin from './ViewPin'
import { STATE } from '@models/STATE'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'

interface Props {
  pin: Pin
  input?: true
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
  mouseDown = () => {
    window.addEventListener('mouseup', this.mouseUp)
    window.addEventListener('mousemove', this.mouseMoveWithPin)
  }
  @action
  mouseMoveWithPin = (e: MouseEvent) => {
    this.viewProps.pin.pos.y = (e.pageY / window.innerHeight) * 100
  }
  mouseUp = () => {
    window.removeEventListener('mousemove', this.mouseMoveWithPin)
    window.removeEventListener('mouseup', this.mouseUp)
  }
}
const SidePin = view(SidePinViewModel)<Props>(({ viewModel }) => {
  return (
    <div
      className={cl.SidePin}
      style={{
        flexDirection: viewModel.viewProps.input ? 'row' : 'row-reverse',
        top: `${viewModel.viewProps.pin.pos.y * windowScalingMethods.scale.y}px`,
        left: viewModel.viewProps.input ? 0 : undefined,
        right: viewModel.viewProps.input ? undefined : 1
      }}
    >
      <div className={cl.Scroll} onMouseDown={viewModel.mouseDown}></div>
      <div
        className={cl.StatusBtn}
        onClick={viewModel.viewProps.selfState && viewModel.changeState}
        style={{
          backgroundColor: viewModel.viewProps.pin.stateColor,
          cursor: viewModel.viewProps.input ? 'pointer' : 'auto'
        }}
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
