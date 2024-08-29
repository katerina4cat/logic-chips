import { ViewModel, view } from '@yoskutik/react-vvm'
import { action, makeObservable } from 'mobx'
import cl from './ViewPin.module.scss'
import { Pin } from '@models/Pin'
import { STATE } from '@models/STATE'
import { Pos } from '@models/common/Pos'
import { createRef } from 'react'
import { wireConnector } from '@renderer/common/GlobalVariables'
import { windowScalingMethods } from '@renderer/common/PointsLineRounding'

interface Props {
  pin: Pin
  side?: boolean
  className?: string
  style?: React.CSSProperties
}

export class ViewPinViewModel extends ViewModel<unknown, Props> {
  constructor() {
    super()
    makeObservable(this)
  }

  @action
  protected onViewMounted(): void {
    window.addEventListener('resize', this.calcPinPosition)
    this.calcPinPosition()
  }

  protected onViewUnmounted(): void {
    if (this.viewProps.side) {
      window.removeEventListener('resize', this.calcPinPosition)
    }
  }
  @action
  calcPinPosition = () => {
    if (this.viewProps.side) {
      const box = this.ref.current!.getBoundingClientRect()
      this.viewProps.pin.pos.x = (box.x + box.width / 2) / windowScalingMethods.scale.x
    } else {
      const box = this.ref.current!.getBoundingClientRect()
      this.viewProps.pin.atChippos = new Pos(box.x + box.width / 2, box.y + box.height / 2)
        .divMe(windowScalingMethods.scale)
        .subMe(this.viewProps.pin.chip.pos)
    }
  }
  ref = createRef<HTMLDivElement>()
}
const ViewPin = view(ViewPinViewModel)<Props>(({ viewModel }) => {
  return (
    <div
      style={{ backgroundColor: viewModel.viewProps.pin.stateColor, ...viewModel.viewProps.style }}
      className={[
        viewModel.viewProps.pin.totalStates[0] !== STATE.ERROR ? '' : 'errorFill',
        cl.Pin,
        viewModel.viewProps.pin.type !== 1 ? cl.CompositePin : '',
        viewModel.viewProps.className
      ].join(' ')}
      ref={viewModel.ref}
      onClick={(e) => wireConnector.current(viewModel.viewProps.pin, e.ctrlKey)}
      onContextMenu={() => console.log(viewModel.viewProps.pin)}
    ></div>
  )
})

export default ViewPin
